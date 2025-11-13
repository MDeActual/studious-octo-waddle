import { motion } from "motion/react";
import { Shield, MapPin, Lock, Eye, FileText, Mail } from "lucide-react";
import { type Locale } from "../lib/i18n";

interface PrivacyPolicyProps {
  locale: Locale;
  onClose?: () => void;
}

const content = {
  'en-CA': {
    title: 'Privacy Policy & PIPEDA Compliance',
    lastUpdated: 'Last Updated: November 9, 2025',
    intro: 'SecurePulse Technology Services ("we", "our", or "us") is committed to protecting your privacy and complying with Canada\'s Personal Information Protection and Electronic Documents Act (PIPEDA) and Quebec\'s Law 25.',
    sections: [
      {
        icon: Eye,
        title: '1. Information We Collect',
        content: `We collect the following types of personal information:
        
**Account Information:** When you sign in with Microsoft Entra ID, we collect your name, email address, organization name, and Azure tenant ID.

**Usage Data:** We collect information about how you use our services, including security assessments, compliance checks, and dashboard interactions.

**Technical Data:** IP addresses, browser type, device information, and session data for security and fraud prevention.

**Microsoft Graph Data:** With your explicit consent, we access Microsoft 365 tenant data including user accounts, security policies, and compliance status through Microsoft Graph API.`
      },
      {
        icon: Lock,
        title: '2. How We Use Your Information',
        content: `We use your personal information for the following purposes:

• **Service Provision:** To provide automated tenant onboarding, security monitoring, and compliance assessments
• **Security Operations:** To monitor security posture, detect threats, and provide AI-powered recommendations
• **Communication:** To send service notifications, security alerts, and important updates
• **Analytics:** To improve our services and develop new features (only with your consent)
• **Compliance:** To meet our legal and regulatory obligations`
      },
      {
        icon: MapPin,
        title: '3. Canadian Data Residency',
        content: `In compliance with PIPEDA and Quebec Law 25:

• All personal data is stored in Microsoft Azure Canada Central and Canada East regions
• Data processing occurs within Canadian borders
• We do not transfer personal data outside Canada without explicit consent
• Our infrastructure meets Canadian data sovereignty requirements`
      },
      {
        icon: Shield,
        title: '4. Data Security & Zero Trust',
        content: `We implement industry-leading security measures:

• **Encryption:** All data is encrypted at rest (AES-256) and in transit (TLS 1.3)
• **Zero Trust Architecture:** Continuous verification, least-privilege access, and micro-segmentation
• **Managed Identities:** No stored passwords or client secrets in application code
• **Azure Key Vault:** All secrets and credentials stored in Azure Key Vault with RBAC
• **Audit Logs:** Comprehensive logging of all access and data operations
• **Regular Assessments:** Quarterly security audits and penetration testing`
      },
      {
        icon: FileText,
        title: '5. Your Rights Under PIPEDA & Law 25',
        content: `You have the following rights:

• **Access:** Request a copy of your personal information
• **Correction:** Request correction of inaccurate information
• **Deletion:** Request deletion of your personal information (right to be forgotten)
• **Portability:** Request your data in a machine-readable format
• **Consent Withdrawal:** Withdraw consent for non-essential data processing at any time
• **Complaint:** File a complaint with the Office of the Privacy Commissioner of Canada

To exercise these rights, contact us at privacy@securepulse.ca`
      },
      {
        icon: Mail,
        title: '6. Cookies & Tracking',
        content: `We use the following types of cookies:

**Essential Cookies:** Required for site functionality (always enabled)
**Analytics Cookies:** Google Analytics for usage statistics (requires consent)

You can manage cookie preferences through our cookie consent banner. We honor Do Not Track (DNT) signals.`
      },
      {
        icon: Shield,
        title: '7. Third-Party Services',
        content: `We use the following third-party services:

• **Microsoft Azure:** Cloud infrastructure (Canada regions only)
• **Microsoft Entra ID:** Authentication and identity management
• **Microsoft Graph API:** Access to customer tenant data (with consent)
• **Stripe:** Payment processing (PCI-DSS compliant, data not stored by us)

All third parties are contractually obligated to comply with PIPEDA and handle data securely.`
      },
      {
        icon: Lock,
        title: '8. Data Retention',
        content: `We retain personal information only as long as necessary:

• **Active Accounts:** Data retained while your account is active
• **Deleted Accounts:** Data deleted within 30 days of account closure
• **Audit Logs:** Retained for 7 years for compliance purposes
• **Backups:** Deleted data purged from backups within 90 days

You can request immediate deletion by contacting privacy@securepulse.ca`
      },
      {
        icon: FileText,
        title: '9. Breach Notification',
        content: `In the event of a data breach affecting your personal information:

• We will notify affected individuals within 72 hours
• Notification will include nature of breach, data involved, and remediation steps
• We will report to the Office of the Privacy Commissioner of Canada as required by PIPEDA
• We maintain a comprehensive incident response plan`
      },
      {
        icon: Mail,
        title: '10. Contact Information',
        content: `For privacy inquiries or to exercise your rights:

**Privacy Officer**
SecurePulse Technology Services
Email: privacy@securepulse.ca
Phone: +1 (XXX) XXX-XXXX

**Office of the Privacy Commissioner of Canada**
30 Victoria Street
Gatineau, Quebec K1A 1H3
Toll-free: 1-800-282-1376
Website: www.priv.gc.ca`
      },
    ],
    footer: 'This privacy policy is effective as of November 9, 2025 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.'
  },
  'fr-CA': {
    title: 'Politique de confidentialité et conformité LPRPDE',
    lastUpdated: 'Dernière mise à jour : 9 novembre 2025',
    intro: 'SecurePulse Services Technologiques (« nous », « notre » ou « nos ») s\'engage à protéger votre vie privée et à se conformer à la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE) du Canada et à la Loi 25 du Québec.',
    sections: [
      {
        icon: Eye,
        title: '1. Renseignements que nous recueillons',
        content: `Nous recueillons les types de renseignements personnels suivants :

**Informations de compte :** Lorsque vous vous connectez avec Microsoft Entra ID, nous recueillons votre nom, adresse courriel, nom d'organisation et ID de locataire Azure.

**Données d'utilisation :** Nous recueillons des informations sur la façon dont vous utilisez nos services, y compris les évaluations de sécurité, les vérifications de conformité et les interactions avec le tableau de bord.

**Données techniques :** Adresses IP, type de navigateur, informations sur l'appareil et données de session pour la sécurité et la prévention de la fraude.

**Données Microsoft Graph :** Avec votre consentement explicite, nous accédons aux données du locataire Microsoft 365, y compris les comptes utilisateur, les politiques de sécurité et l'état de conformité via l'API Microsoft Graph.`
      },
      {
        icon: Lock,
        title: '2. Comment nous utilisons vos renseignements',
        content: `Nous utilisons vos renseignements personnels aux fins suivantes :

• **Prestation de services :** Pour fournir l'intégration automatisée des locataires, la surveillance de la sécurité et les évaluations de conformité
• **Opérations de sécurité :** Pour surveiller la posture de sécurité, détecter les menaces et fournir des recommandations alimentées par l'IA
• **Communication :** Pour envoyer des notifications de service, des alertes de sécurité et des mises à jour importantes
• **Analytique :** Pour améliorer nos services et développer de nouvelles fonctionnalités (uniquement avec votre consentement)
• **Conformité :** Pour respecter nos obligations légales et réglementaires`
      },
      {
        icon: MapPin,
        title: '3. Résidence des données canadiennes',
        content: `En conformité avec la LPRPDE et la Loi 25 du Québec :

• Toutes les données personnelles sont stockées dans les régions Microsoft Azure Canada Centre et Canada Est
• Le traitement des données se fait à l'intérieur des frontières canadiennes
• Nous ne transférons pas de données personnelles à l'extérieur du Canada sans consentement explicite
• Notre infrastructure répond aux exigences de souveraineté des données canadiennes`
      },
      {
        icon: Shield,
        title: '4. Sécurité des données et Zero Trust',
        content: `Nous mettons en œuvre des mesures de sécurité de pointe :

• **Chiffrement :** Toutes les données sont chiffrées au repos (AES-256) et en transit (TLS 1.3)
• **Architecture Zero Trust :** Vérification continue, accès à privilège minimum et micro-segmentation
• **Identités gérées :** Aucun mot de passe ou secret client stocké dans le code de l'application
• **Azure Key Vault :** Tous les secrets et informations d'identification stockés dans Azure Key Vault avec RBAC
• **Journaux d'audit :** Journalisation complète de tous les accès et opérations sur les données
• **Évaluations régulières :** Audits de sécurité trimestriels et tests de pénétration`
      },
      {
        icon: FileText,
        title: '5. Vos droits en vertu de la LPRPDE et de la Loi 25',
        content: `Vous disposez des droits suivants :

• **Accès :** Demander une copie de vos renseignements personnels
• **Correction :** Demander la correction de renseignements inexacts
• **Suppression :** Demander la suppression de vos renseignements personnels (droit à l'oubli)
• **Portabilité :** Demander vos données dans un format lisible par machine
• **Retrait du consentement :** Retirer le consentement pour le traitement de données non essentielles à tout moment
• **Plainte :** Déposer une plainte auprès du Commissariat à la protection de la vie privée du Canada

Pour exercer ces droits, contactez-nous à privacy@securepulse.ca`
      },
      {
        icon: Mail,
        title: '6. Témoins et suivi',
        content: `Nous utilisons les types de témoins suivants :

**Témoins essentiels :** Requis pour la fonctionnalité du site (toujours activés)
**Témoins analytiques :** Google Analytics pour les statistiques d'utilisation (nécessite le consentement)

Vous pouvez gérer vos préférences de témoins via notre bannière de consentement. Nous respectons les signaux Do Not Track (DNT).`
      },
      {
        icon: Shield,
        title: '7. Services tiers',
        content: `Nous utilisons les services tiers suivants :

• **Microsoft Azure :** Infrastructure infonuagique (régions du Canada uniquement)
• **Microsoft Entra ID :** Authentification et gestion des identités
• **API Microsoft Graph :** Accès aux données du locataire client (avec consentement)
• **Stripe :** Traitement des paiements (conforme PCI-DSS, données non stockées par nous)

Tous les tiers sont contractuellement tenus de se conformer à la LPRPDE et de traiter les données en toute sécurité.`
      },
      {
        icon: Lock,
        title: '8. Conservation des données',
        content: `Nous conservons les renseignements personnels uniquement aussi longtemps que nécessaire :

• **Comptes actifs :** Données conservées tant que votre compte est actif
• **Comptes supprimés :** Données supprimées dans les 30 jours suivant la fermeture du compte
• **Journaux d'audit :** Conservés pendant 7 ans à des fins de conformité
• **Sauvegardes :** Données supprimées purgées des sauvegardes dans les 90 jours

Vous pouvez demander une suppression immédiate en contactant privacy@securepulse.ca`
      },
      {
        icon: FileText,
        title: '9. Notification de violation',
        content: `En cas de violation de données affectant vos renseignements personnels :

• Nous aviserons les personnes concernées dans les 72 heures
• La notification comprendra la nature de la violation, les données impliquées et les mesures correctives
• Nous ferons rapport au Commissariat à la protection de la vie privée du Canada comme l'exige la LPRPDE
• Nous maintenons un plan complet d'intervention en cas d'incident`
      },
      {
        icon: Mail,
        title: '10. Coordonnées',
        content: `Pour les demandes de renseignements sur la confidentialité ou pour exercer vos droits :

**Agent de protection de la vie privée**
SecurePulse Services Technologiques
Courriel : privacy@securepulse.ca
Téléphone : +1 (XXX) XXX-XXXX

**Commissariat à la protection de la vie privée du Canada**
30, rue Victoria
Gatineau (Québec) K1A 1H3
Sans frais : 1-800-282-1376
Site Web : www.priv.gc.ca`
      },
    ],
    footer: 'Cette politique de confidentialité est en vigueur à compter du 9 novembre 2025 et le restera sauf en ce qui concerne toute modification de ses dispositions à l\'avenir, qui entreront en vigueur immédiatement après avoir été publiées sur cette page.'
  }
};

export function PrivacyPolicy({ locale, onClose }: PrivacyPolicyProps) {
  const t = content[locale];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#00d4ff]">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl">{t.title}</h1>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {locale === 'en-CA' ? 'Close' : 'Fermer'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div>
            <p className="text-sm text-muted-foreground mb-4">{t.lastUpdated}</p>
            <p className="text-lg text-muted-foreground">{t.intro}</p>
          </div>

          {t.sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-[#0066ff]/10 to-[#00d4ff]/10 border border-[#0066ff]/20">
                  <section.icon className="w-6 h-6 text-[#0066ff]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl mb-4">{section.title}</h2>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-muted-foreground whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          ))}

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-muted-foreground italic">{t.footer}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
