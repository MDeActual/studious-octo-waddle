import { motion } from "motion/react";
import { Shield, Lock, MapPin, CheckCircle2 } from "lucide-react";
import { type Locale, useTranslation } from "../lib/i18n";

interface ComplianceBannerProps {
  locale: Locale;
}

export function ComplianceBanner({ locale }: ComplianceBannerProps) {
  const t = useTranslation(locale);
  
  const badges = [
    { icon: Shield, label: t.compliance.pipeda },
    { icon: CheckCircle2, label: t.compliance.quebecLaw },
    { icon: Lock, label: t.compliance.zeroTrust },
    { icon: MapPin, label: t.compliance.dataResidency },
  ];

  return (
    <section className="relative py-12 px-6 border-y border-white/10 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl mb-2">{t.compliance.title}</h3>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-colors"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#00d4ff]">
                <badge.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-center">{badge.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
