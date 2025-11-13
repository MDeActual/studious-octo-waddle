import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { X, Cookie } from "lucide-react";
import { type Locale } from "../lib/i18n";

interface CookieConsentProps {
  locale: Locale;
}

const translations = {
  'en-CA': {
    title: 'We value your privacy',
    message: 'We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic. By clicking "Accept All", you agree to our use of cookies.',
    essential: 'Essential cookies are required for basic site functionality and are always enabled.',
    analytics: 'Analytics cookies help us understand how visitors interact with our website.',
    learnMore: 'Learn more',
    acceptAll: 'Accept All',
    acceptEssential: 'Essential Only',
    customize: 'Customize',
    privacyPolicy: 'Privacy Policy',
    cookieSettings: 'Cookie Settings',
  },
  'fr-CA': {
    title: 'Nous respectons votre vie privée',
    message: 'Nous utilisons des témoins essentiels pour faire fonctionner notre site. Avec votre consentement, nous pouvons également utiliser des témoins non essentiels pour améliorer l\'expérience utilisateur et analyser le trafic du site.',
    essential: 'Les témoins essentiels sont requis pour les fonctionnalités de base du site et sont toujours activés.',
    analytics: 'Les témoins analytiques nous aident à comprendre comment les visiteurs interagissent avec notre site.',
    learnMore: 'En savoir plus',
    acceptAll: 'Tout accepter',
    acceptEssential: 'Essentiels uniquement',
    customize: 'Personnaliser',
    privacyPolicy: 'Politique de confidentialité',
    cookieSettings: 'Paramètres des témoins',
  }
};

export function CookieConsent({ locale }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const t = translations[locale];

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a brief delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      essential: true,
      analytics: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setIsVisible(false);
    
    // In production, initialize analytics here
    // e.g., initializeGoogleAnalytics();
  };

  const handleAcceptEssential = () => {
    const consent = {
      essential: true,
      analytics: false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-2xl border border-white/20 bg-card/95 backdrop-blur-xl p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-[#0066ff] to-[#00d4ff]">
                  <Cookie className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg mb-2">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.message}
                    </p>
                  </div>

                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="space-y-3 text-sm"
                    >
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span>Essential Cookies</span>
                          <span className="text-xs text-muted-foreground">Always Active</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.essential}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span>Analytics Cookies</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.analytics}</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={handleAcceptAll}
                      className="bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6]"
                    >
                      {t.acceptAll}
                    </Button>
                    <Button
                      onClick={handleAcceptEssential}
                      variant="outline"
                    >
                      {t.acceptEssential}
                    </Button>
                    <Button
                      onClick={() => setShowDetails(!showDetails)}
                      variant="ghost"
                      size="sm"
                    >
                      {showDetails ? t.learnMore : t.customize}
                    </Button>
                    <a
                      href="/privacy"
                      className="text-sm text-muted-foreground hover:text-foreground underline"
                    >
                      {t.privacyPolicy}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
