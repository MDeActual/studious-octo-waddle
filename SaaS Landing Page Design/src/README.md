# SecurePulse Technology Services

Ferrari-quality Microsoft 365 security platform with AI-powered automation, bilingual support (EN-CA/FR-CA), and full PIPEDA/Quebec Law 25 compliance.

## 🚀 Features

### ✅ Automated Onboarding
- **Zero-touch provisioning**: Customers sign in with Microsoft Entra ID
- **Durable Functions workflow**: Automated tenant provisioning via Azure Functions
- **Real-time status**: WebSocket-based progress tracking
- **Teams notifications**: Instant alerts to your team when tenants are provisioned

### 🌐 Bilingual (Canadian)
- **EN-CA and FR-CA** support throughout the entire platform
- Dynamic language switching without page reload
- Compliance documentation in both official languages

### 🔒 Compliance-Ready
- **PIPEDA compliant**: Full Canadian privacy law compliance
- **Quebec Law 25 ready**: Enhanced consent and data residency
- **Zero Trust architecture**: Continuous verification, least-privilege access
- **PCI-DSS aligned**: Ready for payment processing
- **Canadian data residency**: All data stored in Azure Canada regions

### 🤖 AI-Powered Security
- CIS v8 security assessments
- Real-time threat detection
- Automated compliance recommendations
- Microsoft Graph API integration

## 📋 Prerequisites

- Node.js 18+ and npm
- Azure subscription (for backend deployment)
- Microsoft Partner Center account (for PAL/CPOR integration)
- Stripe account (for payments, optional)

## 🛠️ Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd securepulse-web

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
```

**Required environment variables:**

```env
REACT_APP_IDENTITY_SERVICE_URL=https://your-identity-service.azurewebsites.net
```

### 3. Run Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🏗️ Architecture

```
Frontend (This Repo)
    ↓ POST /api/onboard
Identity Service (Azure App Service)
    ↓ Enqueues to Service Bus
Durable Provisioner (Azure Functions)
    ↓ Creates resources
    • Key Vault secrets
    • Storage containers
    • Database records
    • Partner links (PAL/CPOR)
    ↓ Webhook callback
Identity Service
    ↓ Updates database
Frontend (real-time status)
```

## 📁 Project Structure

```
securepulse-web/
├── components/
│   ├── AnimatedBackground.tsx      # Hero gradient effects
│   ├── CISAssessment.tsx           # CIS v8 security assessment
│   ├── ComplianceBanner.tsx        # PIPEDA/Law 25 badges
│   ├── CookieConsent.tsx           # PIPEDA-compliant cookie banner
│   ├── EnvironmentManager.tsx      # Tenant management dashboard
│   ├── FeaturesSection.tsx         # Landing page features
│   ├── LandingHero.tsx             # Hero section
│   ├── LanguageSwitcher.tsx        # EN-CA / FR-CA toggle
│   ├── PricingSection.tsx          # Managed services pricing
│   ├── PrivacyPolicy.tsx           # Full privacy policy page
│   ├── SecurityDashboard.tsx       # Main dashboard
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── i18n.ts                     # Translation system
│   └── backend-integration.ts      # API client for Identity Service
├── styles/
│   └── globals.css                 # Tailwind + custom styles
├── App.tsx                         # Main application
└── .env.example                    # Environment variables template
```

## 🔌 Backend Integration

### Identity Service Endpoints

The frontend expects these endpoints from your Identity Service:

```typescript
POST   /api/onboard              // Start onboarding, get admin consent URL
GET    /api/tenant/:id/status    // Poll provisioning status
GET    /api/tenants              // List all tenants
```

### Example Integration

```typescript
import { startOnboardingFlow } from './lib/backend-integration';

// Trigger onboarding
await startOnboardingFlow({
  plan: 'professional',
  locale: 'en-CA'
}, 'redirect');

// User is redirected to Entra ID admin consent
// After consent, Durable Provisioner runs automatically
// User returns to app with tenant provisioned
```

## 🌍 Deployment

### Deploy to Azure Static Web Apps

```bash
# Build production bundle
npm run build

# Deploy via Azure CLI
az staticwebapp create \
  --name securepulse-web \
  --resource-group securepulse-rg \
  --source . \
  --location canadacentral \
  --branch main \
  --app-location "/" \
  --output-location "build"
```

### Deploy to Azure App Service

```bash
# Build
npm run build

# Deploy
az webapp up \
  --name securepulse-web \
  --resource-group securepulse-rg \
  --runtime "NODE:18-lts" \
  --sku B1 \
  --location canadacentral
```

### Environment Variables (Production)

Set these in Azure Portal → App Service → Configuration:

```
REACT_APP_IDENTITY_SERVICE_URL=https://securepulse-identity.azurewebsites.net
REACT_APP_GA_ID=G-XXXXXXXXXX (optional)
```

## 🔐 Compliance Checklist

### PIPEDA Requirements
- ✅ Cookie consent banner with granular controls
- ✅ Privacy policy with clear data usage explanation
- ✅ User rights (access, correction, deletion)
- ✅ Canadian data residency
- ✅ Breach notification plan
- ✅ Consent management and audit logs

### Quebec Law 25
- ✅ Enhanced consent requirements
- ✅ Privacy impact assessments
- ✅ Data portability
- ✅ Right to be forgotten
- ✅ Quebec-specific privacy policy sections

### Zero Trust
- ✅ Continuous verification (Entra ID)
- ✅ Least-privilege access
- ✅ Assume breach mentality
- ✅ Explicit verification before access

### PCI-DSS (for payments)
- ✅ Use Stripe hosted checkout (no card data touches your servers)
- ✅ TLS 1.3 encryption in transit
- ✅ Secure credential storage (Azure Key Vault)

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📝 Next Steps After Partner Program Approval

Once you receive your Microsoft Partner ID and Partner Center access:

1. **Update Partner Credentials**
   - Add Partner ID to backend Key Vault
   - Configure Partner Center API app registration
   - Enable PAL/CPOR automation in Durable Provisioner

2. **Enable Real Backend**
   - Deploy Identity Service to Azure
   - Deploy Durable Provisioner to Azure Functions
   - Update `REACT_APP_IDENTITY_SERVICE_URL` in production

3. **Test End-to-End**
   - Sign up with test tenant
   - Verify automated provisioning
   - Check Teams notification
   - Confirm PAL/CPOR registration

4. **Go Live**
   - Enable analytics (with cookie consent)
   - Set up monitoring alerts
   - Configure custom domain
   - Launch marketing campaign

## 📞 Support

- **Privacy Inquiries**: privacy@securepulse.ca
- **Technical Support**: support@securepulse.ca
- **Sales**: sales@securepulse.ca

## 📄 License

Proprietary - SecurePulse Technology Services © 2025

---

**Built with**:
- React 18
- TypeScript
- Tailwind CSS
- Motion (Framer Motion)
- shadcn/ui
- Microsoft Graph API
- Azure Functions (Durable)
- Azure App Service
