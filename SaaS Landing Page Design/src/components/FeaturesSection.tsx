import { motion } from "motion/react";
import { Brain, Shield, Zap, BarChart3, Lock, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Machine learning algorithms continuously analyze your security posture and predict potential threats before they occur.",
    gradient: "from-[#0066ff] to-[#00d4ff]"
  },
  {
    icon: Shield,
    title: "Real-time Protection",
    description: "24/7 monitoring with instant threat detection and automated response capabilities across your entire Microsoft 365 environment.",
    gradient: "from-[#00d4ff] to-[#7c3aed]"
  },
  {
    icon: BarChart3,
    title: "CIS v8 Compliance",
    description: "Comprehensive security assessments mapped to CIS benchmarks with actionable remediation steps and progress tracking.",
    gradient: "from-[#7c3aed] to-[#0066ff]"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-100ms response times with intelligent caching and edge computing for instant access to your security data.",
    gradient: "from-[#0066ff] to-[#10b981]"
  },
  {
    icon: Lock,
    title: "Zero Trust Security",
    description: "Granular permission controls with Entra ID integration ensure only authorized users access sensitive security data.",
    gradient: "from-[#10b981] to-[#f59e0b]"
  },
  {
    icon: TrendingUp,
    title: "Predictive Insights",
    description: "Advanced analytics and trend analysis help you stay ahead of emerging threats and compliance requirements.",
    gradient: "from-[#f59e0b] to-[#0066ff]"
  }
];

export function FeaturesSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-4"
        >
          <h2 className="text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Built for Performance
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature engineered to outperform traditional Microsoft portals with AI-first architecture
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
                {/* Hover gradient effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10 space-y-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-300 rounded-full`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
