import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Essential",
    price: "$299",
    period: "/month",
    description: "Perfect for small teams getting started with AI security",
    features: [
      "Up to 100 users",
      "Real-time security monitoring",
      "Basic CIS v8 assessment",
      "Email support",
      "Monthly security reports",
      "Microsoft Graph API access"
    ],
    cta: "Start Essential",
    popular: false
  },
  {
    name: "Professional",
    price: "$799",
    period: "/month",
    description: "Advanced protection for growing organizations",
    features: [
      "Up to 500 users",
      "AI-powered threat detection",
      "Full CIS v8 compliance suite",
      "24/7 priority support",
      "Real-time dashboards",
      "Advanced analytics",
      "Custom security policies",
      "Automated remediation"
    ],
    cta: "Start Professional",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Ultimate security for large organizations",
    features: [
      "Unlimited users",
      "Dedicated AI security team",
      "Custom compliance frameworks",
      "White-glove support",
      "Advanced threat hunting",
      "Custom integrations",
      "SLA guarantees",
      "Dedicated account manager"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
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
              Managed Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your organization. All plans include AI-powered security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative group"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0066ff] to-[#00d4ff] text-white text-sm">
                    <Zap className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`relative h-full p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-[#0066ff]/50 shadow-lg shadow-[#0066ff]/20' 
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
              }`}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>

                  <Button
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-6 rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6] text-white shadow-lg shadow-[#0066ff]/20'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {plan.cta}
                  </Button>

                  <div className="space-y-3 pt-6 border-t border-white/10">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Check className="w-5 h-5 text-[#0066ff]" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {plan.popular && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0066ff]/10 to-[#00d4ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
