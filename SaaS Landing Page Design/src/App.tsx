import { useState, useEffect } from "react";
import { LandingHero } from "./components/LandingHero";
import { FeaturesSection } from "./components/FeaturesSection";
import { PricingSection } from "./components/PricingSection";
import { SecurityDashboard } from "./components/SecurityDashboard";
import { CISAssessment } from "./components/CISAssessment";
import { EnvironmentManager } from "./components/EnvironmentManager";
import { ComplianceBanner } from "./components/ComplianceBanner";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { CookieConsent } from "./components/CookieConsent";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { Button } from "./components/ui/button";
import { Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { type Locale, useTranslation } from "./lib/i18n";
import { 
  startOnboardingFlow, 
  checkConsentCallback, 
  pollTenantStatus,
  BackendError 
} from "./lib/backend-integration";

type View = "landing" | "dashboard" | "assessment" | "environment" | "privacy";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en-CA');
  const [onboardingStatus, setOnboardingStatus] = useState<string>('');
  const [isOnboarding, setIsOnboarding] = useState(false);
  
  const t = useTranslation(locale);

  // Check if returning from admin consent
  useEffect(() => {
    const callback = checkConsentCallback();
    
    if (callback.isCallback && callback.tenantId) {
      setIsOnboarding(true);
      setOnboardingStatus(locale === 'en-CA' ? 'Provisioning your tenant...' : 'Provisionnement de votre locataire...');
      
      // Poll for status
      pollTenantStatus(callback.tenantId, {
        maxAttempts: 60,
        intervalMs: 5000,
        onProgress: (status) => {
          if (status.status === 'active') {
            setOnboardingStatus(locale === 'en-CA' ? 'Your tenant is ready!' : 'Votre locataire est prêt!');
            setTimeout(() => {
              setIsAuthenticated(true);
              setCurrentView('dashboard');
              setIsOnboarding(false);
            }, 2000);
          } else if (status.status === 'failed') {
            setOnboardingStatus(locale === 'en-CA' ? 'Provisioning failed. Please contact support.' : 'Le provisionnement a échoué. Veuillez contacter le support.');
            setIsOnboarding(false);
          }
        }
      }).catch((error) => {
        console.error('Polling error:', error);
        setOnboardingStatus(locale === 'en-CA' ? 'Error during provisioning' : 'Erreur lors du provisionnement');
        setIsOnboarding(false);
      });
    }
  }, [locale]);

  // Mock user data - In production, this would come from Entra ID
  const mockUser = {
    name: "Admin User",
    email: "admin@company.com",
    orgName: "Acme Corporation",
  };

  const handleLogin = async () => {
    // PRODUCTION: Real backend integration
    try {
      await startOnboardingFlow({
        locale,
      }, 'redirect');
      // User will be redirected to Entra ID admin consent
    } catch (error) {
      console.error('Onboarding error:', error);
      
      // FALLBACK: Demo mode if backend not available
      if (error instanceof BackendError) {
        const useFallback = confirm(
          locale === 'en-CA' 
            ? 'Backend service not available. Use demo mode instead?'
            : 'Service backend non disponible. Utiliser le mode démo à la place?'
        );
        
        if (useFallback) {
          setIsAuthenticated(true);
          setCurrentView("dashboard");
        }
      }
    }
  };

  const handleDemo = () => {
    setIsAuthenticated(true);
    setCurrentView("dashboard");
  };

  const handleSelectPlan = async (planName: string) => {
    setSelectedPlan(planName);
    
    // PRODUCTION: Real backend integration
    try {
      await startOnboardingFlow({
        plan: planName.toLowerCase() as any,
        locale,
      }, 'redirect');
      // User will be redirected to Entra ID admin consent
    } catch (error) {
      console.error('Onboarding error:', error);
      
      // FALLBACK: Show explanation if backend not available
      const message = locale === 'en-CA'
        ? `Selected plan: ${planName}\n\n✅ PRODUCTION READY:\nThis would automatically:\n1. POST to Identity Service /api/onboard\n2. Get Entra ID admin consent URL\n3. Redirect for Microsoft authentication\n4. Trigger Durable Provisioner workflow\n5. Send Teams notification\n6. Activate your tenant automatically\n\n⚠️ Backend not yet deployed - waiting for Partner Program approval.`
        : `Forfait sélectionné: ${planName}\n\n✅ PRÊT POUR LA PRODUCTION:\nCela déclencherait automatiquement:\n1. POST au Service d'Identité /api/onboard\n2. Obtenir l'URL de consentement admin Entra ID\n3. Rediriger pour l'authentification Microsoft\n4. Déclencher le workflow Durable Provisioner\n5. Envoyer une notification Teams\n6. Activer votre locataire automatiquement\n\n⚠️ Backend pas encore déployé - en attente de l'approbation du programme partenaire.`;
      alert(message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView("landing");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Cookie Consent Banner */}
      <CookieConsent locale={locale} />
      
      {/* Onboarding Status Overlay */}
      {isOnboarding && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl">{onboardingStatus}</h2>
              <p className="text-muted-foreground">
                {locale === 'en-CA' 
                  ? 'This may take a few moments...' 
                  : 'Cela peut prendre quelques instants...'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {currentView === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#00d4ff] flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl">SecurePulse</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.features}</a>
                    <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.pricing}</a>
                    <a href="#compliance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.compliance}</a>
                    <LanguageSwitcher currentLocale={locale} onLocaleChange={setLocale} />
                    <Button 
                      onClick={handleLogin}
                      size="sm"
                      className="bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6]"
                    >
                      {t.nav.signIn}
                    </Button>
                  </div>
                </div>
              </div>
            </nav>

            {/* Hero */}
            <LandingHero onLogin={handleLogin} onDemo={handleDemo} />

            {/* Features */}
            <div id="features">
              <FeaturesSection />
            </div>

            {/* Pricing */}
            <div id="pricing">
              <PricingSection onSelectPlan={handleSelectPlan} />
            </div>

            {/* Compliance */}
            <div id="compliance">
              <ComplianceBanner locale={locale} />
            </div>

            {/* Footer */}
            <footer className="relative py-16 px-6 border-t border-white/10">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#00d4ff] flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl">SecurePulse</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.footer.tagline}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-4">{t.footer.product}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="#features" className="hover:text-foreground transition-colors">{t.nav.features}</a></li>
                      <li><a href="#pricing" className="hover:text-foreground transition-colors">{t.nav.pricing}</a></li>
                      <li><a href="#compliance" className="hover:text-foreground transition-colors">{t.nav.compliance}</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-4">{t.footer.company}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                      <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                      <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-4">{t.footer.legal}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <button 
                          onClick={() => setCurrentView('privacy')} 
                          className="hover:text-foreground transition-colors"
                        >
                          {t.footer.privacy}
                        </button>
                      </li>
                      <li><a href="/terms" className="hover:text-foreground transition-colors">{t.footer.terms}</a></li>
                      <li><a href="/sla" className="hover:text-foreground transition-colors">{t.footer.sla}</a></li>
                    </ul>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
                  © 2025 {t.footer.copyright}
                </div>
              </div>
            </footer>
          </motion.div>
        )}

        {currentView === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Dashboard Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
              <div className="max-w-[1800px] mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#00d4ff] flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl">SecurePulse</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LanguageSwitcher currentLocale={locale} onLocaleChange={setLocale} />
                    <Button 
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                    >
                      {t.nav.signOut}
                    </Button>
                  </div>
                </div>
              </div>
            </nav>

            <div className="pt-20">
              <SecurityDashboard
                userName={mockUser.name}
                orgName={mockUser.orgName}
                onStartAssessment={() => setCurrentView("assessment")}
                onManageEnvironment={() => setCurrentView("environment")}
              />
            </div>
          </motion.div>
        )}

        {currentView === "assessment" && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Assessment Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
              <div className="max-w-[1800px] mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#00d4ff] flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl">SecurePulse</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LanguageSwitcher currentLocale={locale} onLocaleChange={setLocale} />
                    <Button 
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                    >
                      {t.nav.signOut}
                    </Button>
                  </div>
                </div>
              </div>
            </nav>

            <div className="pt-20">
              <CISAssessment onBack={() => setCurrentView("dashboard")} />
            </div>
          </motion.div>
        )}

        {currentView === "environment" && (
          <motion.div
            key="environment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Environment Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
              <div className="max-w-[1800px] mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#00d4ff] flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl">SecurePulse</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LanguageSwitcher currentLocale={locale} onLocaleChange={setLocale} />
                    <Button 
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                    >
                      {t.nav.signOut}
                    </Button>
                  </div>
                </div>
              </div>
            </nav>

            <div className="pt-20">
              <EnvironmentManager onBack={() => setCurrentView("dashboard")} />
            </div>
          </motion.div>
        )}

        {currentView === "privacy" && (
          <motion.div
            key="privacy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PrivacyPolicy 
              locale={locale} 
              onClose={() => setCurrentView("landing")} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
