import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Shield, Sparkles, Zap } from "lucide-react";
import { AnimatedBackground } from "./AnimatedBackground";

interface LandingHeroProps {
  onLogin: () => void;
  onDemo: () => void;
}

export function LandingHero({ onLogin, onDemo }: LandingHeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-[#0066ff]" />
            <span className="text-sm text-muted-foreground">AI-Powered Microsoft 365 Security</span>
          </motion.div>

          {/* Main headline */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl tracking-tight max-w-5xl mx-auto">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Enterprise Security,
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#0066ff] via-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">
                Ferrari Speed
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              AI-managed Microsoft 365 security that makes traditional portals look like yesterday's technology. 
              Real-time posture monitoring, automated compliance, and intelligent threat detection.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={onLogin}
              size="lg"
              className="bg-gradient-to-r from-[#0066ff] to-[#0052cc] hover:from-[#0052cc] hover:to-[#0041a3] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#0066ff]/20 hover:shadow-[#0066ff]/40 transition-all duration-300"
            >
              <Shield className="w-5 h-5 mr-2" />
              Sign in with Entra ID
            </Button>
            <Button
              onClick={onDemo}
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg rounded-xl transition-all duration-300"
            >
              <Zap className="w-5 h-5 mr-2" />
              See Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto"
          >
            {[
              { value: "99.9%", label: "Uptime SLA" },
              { value: "<100ms", label: "Response Time" },
              { value: "24/7", label: "AI Monitoring" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <motion.div 
            className="w-1.5 h-1.5 bg-white/60 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
}
