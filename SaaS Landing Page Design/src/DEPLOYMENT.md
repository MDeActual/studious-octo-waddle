# SecurePulse Deployment Guide

Complete step-by-step guide to deploy your production-ready platform.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Azure subscription
- ✅ Azure CLI installed (`az --version`)
- ✅ Node.js 18+ installed
- ✅ Microsoft Partner Center account (or in progress)
- ✅ Custom domain (optional but recommended)
- ✅ SSL certificate (or use Azure-managed)

---

## 🏗️ Infrastructure Setup

### 1. Resource Group

```bash
# Create resource group in Canada Central
az group create \
  --name securepulse-rg \
  --location canadacentral

# Verify
az group show --name securepulse-rg
```

### 2. Storage Account (for Function App)

```bash
az storage account create \
  --name securepulsestorage \
  --resource-group securepulse-rg \
  --location canadacentral \
  --sku Standard_LRS \
  --kind StorageV2
```

### 3. PostgreSQL Database

```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --name securepulse-db \
  --resource-group securepulse-rg \
  --location canadacentral \
  --admin-user spadmin \
  --admin-password '<STRONG_PASSWORD>' \
  --sku-name Standard_D2s_v3 \
  --tier GeneralPurpose \
  --version 15 \
  --storage-size 128

# Create database
az postgres flexible-server db create \
  --resource-group securepulse-rg \
  --server-name securepulse-db \
  --database-name securepulse

# Get connection string
az postgres flexible-server show-connection-string \
  --server-name securepulse-db \
  --database-name securepulse
```

### 4. Service Bus

```bash
# Create Service Bus namespace
az servicebus namespace create \
  --name securepulse-sb \
  --resource-group securepulse-rg \
  --location canadacentral \
  --sku Standard

# Create queue
az servicebus queue create \
  --namespace-name securepulse-sb \
  --resource-group securepulse-rg \
  --name provision-requests

# Get connection string
az servicebus namespace authorization-rule keys list \
  --resource-group securepulse-rg \
  --namespace-name securepulse-sb \
  --name RootManageSharedAccessKey \
  --query primaryConnectionString \
  --output tsv
```

### 5. Key Vault

```bash
# Create Key Vault
az keyvault create \
  --name securepulse-kv \
  --resource-group securepulse-rg \
  --location canadacentral

# Store secrets
az keyvault secret set --vault-name securepulse-kv --name pg-conn --value "<POSTGRES_CONNECTION_STRING>"
az keyvault secret set --vault-name securepulse-kv --name sb-conn --value "<SERVICE_BUS_CONNECTION_STRING>"
az keyvault secret set --vault-name securepulse-kv --name entra-client-secret --value "<ENTRA_CLIENT_SECRET>"

# Partner secrets (add after Partner Center approval)
az keyvault secret set --vault-name securepulse-kv --name partner-tenant-id --value "to-fill"
az keyvault secret set --vault-name securepulse-kv --name partner-app-id --value "to-fill"
az keyvault secret set --vault-name securepulse-kv --name partner-app-secret --value "to-fill"
az keyvault secret set --vault-name securepulse-kv --name partner-mpn-id --value "to-fill"
```

---

## 🔧 Backend Deployment

### 1. Identity Service (App Service)

```bash
# Create App Service Plan
az appservice plan create \
  --name securepulse-plan \
  --resource-group securepulse-rg \
  --location canadacentral \
  --sku P1V2 \
  --is-linux

# Create Web App
az webapp create \
  --name securepulse-identity \
  --resource-group securepulse-rg \
  --plan securepulse-plan \
  --runtime "NODE:18-lts"

# Enable Managed Identity
az webapp identity assign \
  --name securepulse-identity \
  --resource-group securepulse-rg

# Get Managed Identity Principal ID
IDENTITY_ID=$(az webapp identity show \
  --name securepulse-identity \
  --resource-group securepulse-rg \
  --query principalId \
  --output tsv)

# Grant Key Vault access
az keyvault set-policy \
  --name securepulse-kv \
  --object-id $IDENTITY_ID \
  --secret-permissions get list

# Configure app settings (using Key Vault references)
az webapp config appsettings set \
  --name securepulse-identity \
  --resource-group securepulse-rg \
  --settings \
    ENTRA_CLIENT_ID="<YOUR_ENTRA_CLIENT_ID>" \
    ENTRA_TENANT_ID="<YOUR_ENTRA_TENANT_ID>" \
    ENTRA_CLIENT_SECRET="@Microsoft.KeyVault(SecretUri=https://securepulse-kv.vault.azure.net/secrets/entra-client-secret)" \
    DATABASE_URL="@Microsoft.KeyVault(SecretUri=https://securepulse-kv.vault.azure.net/secrets/pg-conn)" \
    SERVICE_BUS_FQDN="securepulse-sb.servicebus.windows.net" \
    SERVICE_BUS_QUEUE="provision-requests" \
    PROVISIONER_WEBHOOK_SECRET="<GENERATE_RANDOM_STRING>"

# Enable HTTPS only
az webapp update \
  --name securepulse-identity \
  --resource-group securepulse-rg \
  --https-only true

# Deploy code (from your identity-service directory)
cd ../identity-service
zip -r identity.zip .
az webapp deployment source config-zip \
  --name securepulse-identity \
  --resource-group securepulse-rg \
  --src identity.zip
```

### 2. Durable Provisioner (Function App)

```bash
# Create Function App
az functionapp create \
  --name securepulse-provisioner \
  --resource-group securepulse-rg \
  --storage-account securepulsestorage \
  --consumption-plan-location canadacentral \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --os-type Linux

# Enable Managed Identity
az functionapp identity assign \
  --name securepulse-provisioner \
  --resource-group securepulse-rg

# Get Managed Identity Principal ID
FUNC_IDENTITY_ID=$(az functionapp identity show \
  --name securepulse-provisioner \
  --resource-group securepulse-rg \
  --query principalId \
  --output tsv)

# Grant permissions
# Key Vault
az keyvault set-policy \
  --name securepulse-kv \
  --object-id $FUNC_IDENTITY_ID \
  --secret-permissions get list set

# Storage (for creating containers)
STORAGE_ID=$(az storage account show \
  --name securepulsestorage \
  --resource-group securepulse-rg \
  --query id \
  --output tsv)

az role assignment create \
  --assignee $FUNC_IDENTITY_ID \
  --role "Storage Blob Data Contributor" \
  --scope $STORAGE_ID

# Service Bus (receiver role)
SB_ID=$(az servicebus namespace show \
  --name securepulse-sb \
  --resource-group securepulse-rg \
  --query id \
  --output tsv)

az role assignment create \
  --assignee $FUNC_IDENTITY_ID \
  --role "Azure Service Bus Data Receiver" \
  --scope $SB_ID

# Configure app settings
az functionapp config appsettings set \
  --name securepulse-provisioner \
  --resource-group securepulse-rg \
  --settings \
    AZURE_MODE="true" \
    PG_CONN="@Microsoft.KeyVault(SecretUri=https://securepulse-kv.vault.azure.net/secrets/pg-conn)" \
    KEYVAULT_NAME="securepulse-kv" \
    STORAGE_ACCOUNT="securepulsestorage" \
    SERVICE_BUS_CONNECTION="@Microsoft.KeyVault(SecretUri=https://securepulse-kv.vault.azure.net/secrets/sb-conn)" \
    WEBHOOK_URL="https://securepulse-identity.azurewebsites.net/api/webhook/provisioning" \
    WEBHOOK_SECRET="<SAME_AS_IDENTITY_SERVICE>" \
    TEAMS_WEBHOOK_URL="<YOUR_TEAMS_WEBHOOK_URL>"

# Deploy code
cd ../durable-provisioner
func azure functionapp publish securepulse-provisioner
```

---

## 🌐 Frontend Deployment

### Option A: Azure Static Web Apps (Recommended)

```bash
# Build frontend
cd ../securepulse-web
npm run build

# Create Static Web App
az staticwebapp create \
  --name securepulse-web \
  --resource-group securepulse-rg \
  --location canadacentral

# Get deployment token
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name securepulse-web \
  --resource-group securepulse-rg \
  --query properties.apiKey \
  --output tsv)

# Deploy
npm install -g @azure/static-web-apps-cli
swa deploy ./build \
  --deployment-token $DEPLOYMENT_TOKEN

# Set environment variables
az staticwebapp appsettings set \
  --name securepulse-web \
  --setting-names \
    REACT_APP_IDENTITY_SERVICE_URL="https://securepulse-identity.azurewebsites.net"
```

### Option B: Azure App Service

```bash
# Create Web App for frontend
az webapp create \
  --name securepulse-web \
  --resource-group securepulse-rg \
  --plan securepulse-plan \
  --runtime "NODE:18-lts"

# Configure environment
az webapp config appsettings set \
  --name securepulse-web \
  --resource-group securepulse-rg \
  --settings \
    REACT_APP_IDENTITY_SERVICE_URL="https://securepulse-identity.azurewebsites.net"

# Build and deploy
npm run build
cd build
zip -r ../web.zip .
cd ..
az webapp deployment source config-zip \
  --name securepulse-web \
  --resource-group securepulse-rg \
  --src web.zip
```

---

## 🔒 Security Hardening

### 1. Enable HTTPS Everywhere

```bash
# Identity Service
az webapp update --name securepulse-identity --resource-group securepulse-rg --https-only true

# Frontend
az webapp update --name securepulse-web --resource-group securepulse-rg --https-only true
```

### 2. Configure CORS

```bash
# Allow frontend to call Identity Service
az webapp cors add \
  --name securepulse-identity \
  --resource-group securepulse-rg \
  --allowed-origins "https://securepulse-web.azurewebsites.net"

# Add custom domain when ready
az webapp cors add \
  --name securepulse-identity \
  --resource-group securepulse-rg \
  --allowed-origins "https://www.securepulse.ca"
```

### 3. Enable Diagnostic Logging

```bash
# Create Log Analytics Workspace
az monitor log-analytics workspace create \
  --resource-group securepulse-rg \
  --workspace-name securepulse-logs \
  --location canadacentral

# Get Workspace ID
WORKSPACE_ID=$(az monitor log-analytics workspace show \
  --resource-group securepulse-rg \
  --workspace-name securepulse-logs \
  --query id \
  --output tsv)

# Enable diagnostics for Identity Service
az monitor diagnostic-settings create \
  --name identity-diagnostics \
  --resource /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/securepulse-rg/providers/Microsoft.Web/sites/securepulse-identity \
  --workspace $WORKSPACE_ID \
  --logs '[{"category": "AppServiceHTTPLogs","enabled": true},{"category": "AppServiceConsoleLogs","enabled": true}]'
```

---

## 🎯 Custom Domain Setup

### 1. Add Custom Domain

```bash
# Frontend
az webapp config hostname add \
  --webapp-name securepulse-web \
  --resource-group securepulse-rg \
  --hostname www.securepulse.ca

# Identity Service (API subdomain)
az webapp config hostname add \
  --webapp-name securepulse-identity \
  --resource-group securepulse-rg \
  --hostname api.securepulse.ca
```

### 2. Enable SSL

```bash
# Azure-managed certificate (free)
az webapp config ssl bind \
  --name securepulse-web \
  --resource-group securepulse-rg \
  --certificate-thumbprint auto \
  --ssl-type SNI
```

---

## 📊 Monitoring Setup

### 1. Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app securepulse-insights \
  --location canadacentral \
  --resource-group securepulse-rg \
  --workspace $WORKSPACE_ID

# Get Instrumentation Key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app securepulse-insights \
  --resource-group securepulse-rg \
  --query instrumentationKey \
  --output tsv)

# Add to Identity Service
az webapp config appsettings set \
  --name securepulse-identity \
  --resource-group securepulse-rg \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY

# Add to Function App
az functionapp config appsettings set \
  --name securepulse-provisioner \
  --resource-group securepulse-rg \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY
```

### 2. Alerts

```bash
# Alert on 5xx errors
az monitor metrics alert create \
  --name "Identity Service 5xx Errors" \
  --resource-group securepulse-rg \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/securepulse-rg/providers/Microsoft.Web/sites/securepulse-identity \
  --condition "avg Http5xx > 5" \
  --description "Alert when 5xx errors exceed threshold" \
  --evaluation-frequency 5m \
  --window-size 15m \
  --severity 2
```

---

## ✅ Post-Deployment Verification

### 1. Health Checks

```bash
# Test Identity Service
curl https://securepulse-identity.azurewebsites.net/health

# Test frontend
curl https://securepulse-web.azurewebsites.net/

# Test Function App
curl https://securepulse-provisioner.azurewebsites.net/api/HttpStart
```

### 2. Database Migration

```bash
# Connect to PostgreSQL
psql "host=securepulse-db.postgres.database.azure.com port=5432 dbname=securepulse user=spadmin password=<PASSWORD> sslmode=require"

# Run migrations
\i /path/to/migrations.sql

# Verify tables
\dt
```

### 3. End-to-End Test

See `INTEGRATION_CHECKLIST.md` Section 3.

---

## 🚀 Going Live

### Pre-Launch Checklist
- [ ] All services deployed and healthy
- [ ] Database migrated
- [ ] Secrets in Key Vault
- [ ] HTTPS enabled everywhere
- [ ] Custom domain configured
- [ ] SSL certificates active
- [ ] Monitoring and alerts configured
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent working
- [ ] Backup strategy defined
- [ ] Disaster recovery plan documented

### Launch Steps
1. Update DNS to point to Azure
2. Test from external network
3. Monitor Application Insights for errors
4. Announce on social media / email list
5. Enable Google Analytics (with cookie consent)

---

## 📞 Support & Maintenance

### View Logs
```bash
# Identity Service logs
az webapp log tail --name securepulse-identity --resource-group securepulse-rg

# Function App logs
az webapp log tail --name securepulse-provisioner --resource-group securepulse-rg
```

### Scale Up
```bash
# Upgrade App Service Plan
az appservice plan update \
  --name securepulse-plan \
  --resource-group securepulse-rg \
  --sku P2V2
```

### Backup Database
```bash
# Configure automated backups
az postgres flexible-server backup create \
  --resource-group securepulse-rg \
  --name securepulse-db \
  --backup-name daily-backup
```

---

## 🎉 You're Live!

Your production-ready SecurePulse platform is now deployed and ready to onboard customers automatically!

**Next**: Complete Partner Center setup and enable PAL/CPOR automation.
