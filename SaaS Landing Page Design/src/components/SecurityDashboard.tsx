import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Lock,
  Activity,
  BarChart3,
  Bell,
  Settings
} from "lucide-react";
import { 
  Area,
  AreaChart, 
  Bar,
  BarChart,
  CartesianGrid, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

// Mock data - replace with real Microsoft Graph API data
const securityScoreData = [
  { date: "Nov 1", score: 72 },
  { date: "Nov 2", score: 74 },
  { date: "Nov 3", score: 73 },
  { date: "Nov 4", score: 78 },
  { date: "Nov 5", score: 81 },
  { date: "Nov 6", score: 85 },
  { date: "Nov 7", score: 87 },
  { date: "Nov 8", score: 89 },
];

const threatData = [
  { category: "Phishing", count: 12 },
  { category: "Malware", count: 8 },
  { category: "Ransomware", count: 3 },
  { category: "Insider", count: 5 },
  { category: "DDoS", count: 2 },
];

const recentAlerts = [
  { id: 1, severity: "high", title: "Suspicious login from new location", time: "2 min ago", user: "john@company.com" },
  { id: 2, severity: "medium", title: "Unusual file sharing activity detected", time: "15 min ago", user: "sarah@company.com" },
  { id: 3, severity: "low", title: "Password expiring in 7 days", time: "1 hour ago", user: "mike@company.com" },
  { id: 4, severity: "high", title: "Multiple failed login attempts", time: "2 hours ago", user: "admin@company.com" },
];

interface SecurityDashboardProps {
  userName: string;
  orgName: string;
  onStartAssessment: () => void;
  onManageEnvironment: () => void;
}

export function SecurityDashboard({ userName, orgName, onStartAssessment, onManageEnvironment }: SecurityDashboardProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-[1800px] mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl mb-2">Security Command Center</h1>
            <p className="text-muted-foreground">
              {orgName} • {userName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: Shield, 
              label: "Security Score", 
              value: "89", 
              change: "+12%", 
              trend: "up",
              gradient: "from-[#0066ff] to-[#00d4ff]"
            },
            { 
              icon: AlertTriangle, 
              label: "Active Threats", 
              value: "4", 
              change: "-25%", 
              trend: "down",
              gradient: "from-[#ef4444] to-[#f59e0b]"
            },
            { 
              icon: CheckCircle2, 
              label: "Compliance", 
              value: "94%", 
              change: "+8%", 
              trend: "up",
              gradient: "from-[#10b981] to-[#00d4ff]"
            },
            { 
              icon: Users, 
              label: "Protected Users", 
              value: "1,247", 
              change: "+5%", 
              trend: "up",
              gradient: "from-[#7c3aed] to-[#0066ff]"
            },
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/[0.02] border-white/10 hover:bg-white/[0.05] transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.gradient}`}>
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      metric.trend === 'up' ? 'border-green-500/50 text-green-400' : 'border-blue-500/50 text-blue-400'
                    } bg-transparent`}
                  >
                    {metric.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Score Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-white/[0.02] border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl mb-1">Security Score Trend</h3>
                  <p className="text-sm text-muted-foreground">Last 7 days performance</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={securityScoreData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0066ff" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#0066ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a24', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#0066ff" 
                    strokeWidth={2}
                    fill="url(#scoreGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 bg-white/[0.02] border-white/10 h-full">
              <h3 className="text-xl mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Button 
                  onClick={onStartAssessment}
                  className="w-full justify-start gap-3 bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6] text-white py-6"
                >
                  <BarChart3 className="w-5 h-5" />
                  Start CIS v8 Assessment
                </Button>
                <Button 
                  onClick={onManageEnvironment}
                  variant="outline"
                  className="w-full justify-start gap-3 border-white/10 hover:bg-white/5 py-6"
                >
                  <Lock className="w-5 h-5" />
                  Manage Environment
                </Button>
                <Button 
                  variant="outline"
                  className="w-full justify-start gap-3 border-white/10 hover:bg-white/5 py-6"
                >
                  <Activity className="w-5 h-5" />
                  View Activity Log
                </Button>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-[#0066ff]/10 to-[#00d4ff]/10 border border-[#0066ff]/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#0066ff] mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm">AI Recommendation</p>
                    <p className="text-xs text-muted-foreground">
                      Enable MFA for 12 users to improve security score by 8 points
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Threat Detection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-white/[0.02] border-white/10">
              <h3 className="text-xl mb-6">Threat Detection</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={threatData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="category" 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a24', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#0066ff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-white/[0.02] border-white/10">
              <h3 className="text-xl mb-6">Recent Alerts</h3>
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <div 
                    key={alert.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="mb-1">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.user} • {alert.time}
                      </p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={`${
                        alert.severity === 'high' ? 'border-red-500/50 text-red-400' :
                        alert.severity === 'medium' ? 'border-yellow-500/50 text-yellow-400' :
                        'border-blue-500/50 text-blue-400'
                      } bg-transparent capitalize`}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
