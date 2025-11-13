# SecurePulse Integration Checklist

This checklist ensures all components are properly integrated and ready for production.

## ✅ Frontend Checklist

### 1. Bilingual Support
- [ ] Landing page displays in EN-CA and FR-CA
- [ ] Language switcher toggles all text
- [ ] Privacy policy available in both languages
- [ ] Cookie consent banner translates properly
- [ ] Dashboard labels translate on language switch

**Test**: Click language switcher, verify all visible text changes.

---

### 2. Cookie Consent (PIPEDA/Law 25)
- [ ] Banner appears on first visit
- [ ] "Accept All" stores consent in localStorage
- [ ] "Essential Only" stores minimal consent
- [ ] Consent choice persists on page reload
- [ ] "Customize" shows detailed cookie options
- [ ] Privacy policy link works from consent banner

**Test**: 
```javascript
// Open DevTools Console
localStorage.removeItem('cookie-consent');
// Reload page - banner should appear
// Click "Accept All"
console.log(JSON.parse(localStorage.getItem('cookie-consent')));
// Should show: { essential: true, analytics: true, timestamp: "...", version: "1.0" }
```

---

### 3. Privacy Policy Page
- [ ] Accessible via footer link
- [ ] All 10 sections render properly
- [ ] Icons display correctly
- [ ] "Close" button returns to landing page
- [ ] Content matches PIPEDA requirements
- [ ] Quebec Law 25 specifics included

**Test**: Click "Privacy & PIPEDA" in footer, scroll through all sections.

---

### 4. Backend Integration (Ready, Not Active)
- [ ] `REACT_APP_IDENTITY_SERVICE_URL` in .env.local
- [ ] "Sign in with Entra ID" button calls `startOnboardingFlow()`
- [ ] Error handling shows demo mode fallback
- [ ] Plan selection triggers onboarding attempt
- [ ] Console shows backend connection attempts

**Test (without backend)**:
```bash
# Start frontend
npm start

# Click "Sign in with Entra ID"
# Should show alert: "Backend service not available. Use demo mode instead?"
# Click OK → should enter demo dashboard

# Check browser console for errors
# Should see: BackendError with connection details
```

---

### 5. Onboarding Status Overlay
- [ ] Appears when returning from admin consent
- [ ] Shows spinner and status text
- [ ] Polls tenant status every 5 seconds
- [ ] Transitions to dashboard on "active"
- [ ] Shows error message on "failed"

**Test (mock)**:
```javascript
// Simulate consent callback
window.location.href = '/?tenantId=test-123';
// Reload page
// Should show "Provisioning your tenant..." overlay
// (Will timeout after 5 minutes if no backend)
```

---

### 6. Compliance Banner
- [ ] Shows 4 compliance badges
- [ ] PIPEDA badge visible
- [ ] Quebec Law 25 badge visible
- [ ] Zero Trust badge visible
- [ ] Canadian Data Residency badge visible
- [ ] Animations work on scroll

**Test**: Scroll to compliance section, verify all 4 badges animate in.

---

## 🔌 Backend Integration (When Ready)

### 1. Identity Service Setup

```bash
# Deploy Identity Service to Azure
az webapp create \
  --name securepulse-identity \
  --resource-group securepulse-rg \
  --plan securepulse-plan \
  --runtime "NODE:18-lts"

# Set environment variables
az webapp config appsettings set \
  --name securepulse-identity \
  --resource-group securepulse-rg \
  --settings \
    ENTRA_CLIENT_ID="<your-client-id>" \
    ENTRA_CLIENT_SECRET="@Microsoft.KeyVault(SecretUri=https://...)" \
    ENTRA_TENANT_ID="<your-tenant-id>" \
    SERVICE_BUS_FQDN="securepulse-sb.servicebus.windows.net" \
    PG_CONN="@Microsoft.KeyVault(SecretUri=https://...)"
```

**Checklist**:
- [ ] Identity Service deployed and running
- [ ] `/api/onboard` endpoint returns 200
- [ ] `/api/tenant/:id/status` endpoint works
- [ ] CORS allows frontend domain
- [ ] HTTPS certificate valid
- [ ] Managed Identity enabled

**Test**:
```bash
# Test onboard endpoint
curl -X POST https://securepulse-identity.azurewebsites.net/api/onboard \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Co","adminEmail":"test@example.com"}'

# Should return: { "adminConsentUrl": "https://...", "tempTenantId": "..." }
```

---

### 2. Durable Provisioner Setup

```bash
# Deploy Durable Provisioner
func azure functionapp publish securepulse-provisioner

# Verify Service Bus connection
az servicebus queue show \
  --name provision-requests \
  --namespace-name securepulse-sb \
  --resource-group securepulse-rg
```

**Checklist**:
- [ ] Function App deployed
- [ ] Service Bus queue exists
- [ ] Managed Identity has Key Vault access
- [ ] Managed Identity has Storage Blob access
- [ ] Webhook URL configured
- [ ] AZURE_MODE=true in production

**Test**:
```bash
# Send test message to Service Bus
az servicebus queue message send \
  --namespace-name securepulse-sb \
  --queue-name provision-requests \
  --body '{"tenantId":"test","azureTenantGuid":"guid","tenantName":"Test"}'

# Check Function App logs
az webapp log tail --name securepulse-provisioner --resource-group securepulse-rg

# Should see: "Started orchestration with id = tenant-test"
```

---

### 3. End-to-End Test (Production)

**Scenario**: New customer signs up for Professional plan

1. **User Action**: Click "Start Professional" on pricing page
   - [ ] Frontend calls `startOnboardingFlow({ plan: 'professional' })`
   - [ ] POST to `/api/onboard` with plan details

2. **Identity Service**: Creates tentative tenant record
   - [ ] Returns `adminConsentUrl`
   - [ ] Stores `tempTenantId` in session

3. **User Action**: Redirected to Entra ID admin consent
   - [ ] Consent screen shows requested permissions
   - [ ] User approves

4. **Entra ID Callback**: Redirects back with authorization code
   - [ ] Identity Service receives callback at `/api/auth/callback`
   - [ ] Exchanges code for tenant info via Graph API
   - [ ] Enqueues provisioning request to Service Bus

5. **Durable Provisioner**: Starts orchestration
   - [ ] Orchestrator instance ID = `tenant-<uuid>`
   - [ ] `checkExistingProvision` activity runs
   - [ ] `createTenantConfig` activity runs
   - [ ] `createKeyVaultSecret` activity runs (if AZURE_MODE=true)
   - [ ] `createStorageContainer` activity runs (if AZURE_MODE=true)
   - [ ] `finalizeProvision` activity runs
   - [ ] `sendProvisionWebhook` activity runs
   - [ ] `sendTeamsCard` activity runs (optional)

6. **Webhook Callback**: Identity Service receives webhook
   - [ ] Updates tenant status to "active"
   - [ ] Stores Key Vault URI and storage container name
   - [ ] Optional: Sends notification to Teams/Slack

7. **Frontend**: User sees completion
   - [ ] Status overlay shows "Your tenant is ready!"
   - [ ] Transitions to dashboard
   - [ ] Dashboard loads tenant data

**Verify**:
```sql
-- Check database
SELECT * FROM tenants WHERE status = 'active';
SELECT * FROM tenant_config WHERE tenant_id = '<uuid>';
SELECT * FROM tenant_partner_links WHERE tenant_id = '<uuid>';
```

---

### 4. Partner Center Integration (After Approval)

**When you receive Partner ID**:

1. **Update Key Vault Secrets**:
```bash
az keyvault secret set \
  --vault-name securepulse-kv \
  --name partner-tenant-id \
  --value "<your-partner-tenant-id>"

az keyvault secret set \
  --vault-name securepulse-kv \
  --name partner-app-id \
  --value "<your-partner-app-id>"

az keyvault secret set \
  --vault-name securepulse-kv \
  --name partner-app-secret \
  --value "<your-partner-app-secret>"

az keyvault secret set \
  --vault-name securepulse-kv \
  --name partner-mpn-id \
  --value "<your-mpn-id>"
```

2. **Enable Partner Links**:
   - [ ] Replace mock `registerPartnerLinks` activity with real code
   - [ ] Deploy updated Durable Provisioner

3. **Test PAL/CPOR**:
   - [ ] Provision a test tenant
   - [ ] Check Partner Center for new customer relationship
   - [ ] Verify PAL link shows up in Partner Center analytics

---

## 🧪 Manual Testing Scenarios

### Scenario 1: French-speaking Quebec customer
1. User lands on site
2. Clicks "FR" in navigation
3. All text changes to French
4. Cookie consent appears in French
5. User clicks "Politique de confidentialité"
6. Privacy policy loads in French
7. User clicks "Commencer Professionnel"
8. Onboarding flow proceeds in French

**Expected**: Zero English text visible after language switch.

---

### Scenario 2: Cookie consent rejection
1. User lands on site
2. Cookie consent banner appears
3. User clicks "Essential Only"
4. Banner disappears
5. Reload page
6. Banner does not reappear
7. Check localStorage: `analytics: false`

**Expected**: Google Analytics (if configured) should NOT load.

---

### Scenario 3: Backend unavailable
1. Set `REACT_APP_IDENTITY_SERVICE_URL=https://fake-url.invalid`
2. Click "Sign in with Entra ID"
3. Error caught
4. Alert: "Backend service not available. Use demo mode instead?"
5. Click "OK"
6. Enter demo dashboard

**Expected**: Graceful degradation, no app crash.

---

## 📊 Performance Checklist

- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 95 (Accessibility)
- [ ] Lighthouse score > 95 (Best Practices)
- [ ] Lighthouse score > 100 (SEO)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] No console errors on production build

**Test**:
```bash
npm run build
npx serve -s build
# Open Chrome DevTools → Lighthouse → Run audit
```

---

## 🔒 Security Checklist

- [ ] No secrets in frontend code
- [ ] All API calls use HTTPS
- [ ] CORS properly configured
- [ ] CSP headers set (if using Azure)
- [ ] No XSS vulnerabilities
- [ ] No sensitive data in localStorage (only consent preferences)
- [ ] Cookie flags: Secure, HttpOnly (for auth cookies)

---

## 🚀 Pre-Launch Checklist

### Technical
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No console warnings in production
- [ ] Error boundary implemented
- [ ] 404 page configured
- [ ] robots.txt configured
- [ ] sitemap.xml generated

### Compliance
- [ ] Privacy policy reviewed by legal
- [ ] Terms of service finalized
- [ ] SLA document published
- [ ] Cookie consent tested in both languages
- [ ] Data residency confirmed (Azure Canada regions)
- [ ] PIPEDA compliance audit complete

### Business
- [ ] Partner Program approved
- [ ] Partner ID received
- [ ] PAL/CPOR automation tested
- [ ] Payment provider configured (Stripe)
- [ ] Pricing confirmed
- [ ] Marketing materials ready
- [ ] Support email configured

### Monitoring
- [ ] Azure Application Insights enabled
- [ ] Alerts configured for errors
- [ ] Uptime monitoring (Azure Monitor or Pingdom)
- [ ] Budget alerts set
- [ ] Log retention policy defined

---

## ✅ Sign-Off

**Date**: _____________

**Tested By**: _____________

**Status**: 
- [ ] Ready for Production
- [ ] Needs Fixes (see notes below)
- [ ] Blocked (waiting for Partner approval)

**Notes**:
_______________________________________________________
_______________________________________________________
_______________________________________________________

---

🎉 **Once all items are checked, you're ready to launch!**
