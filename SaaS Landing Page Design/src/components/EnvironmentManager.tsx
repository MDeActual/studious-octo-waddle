import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  ArrowLeft,
  Search,
  Shield,
  Users,
  Key,
  Cloud,
  FileText,
  Settings,
  Lock,
  Unlock,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

// Mock Microsoft Graph data
const mockUsers = [
  { id: "1", name: "John Smith", email: "john@company.com", role: "Global Admin", mfa: true, status: "active" },
  { id: "2", name: "Sarah Johnson", email: "sarah@company.com", role: "Security Admin", mfa: true, status: "active" },
  { id: "3", name: "Mike Davis", email: "mike@company.com", role: "User Admin", mfa: false, status: "active" },
  { id: "4", name: "Emily Brown", email: "emily@company.com", role: "User", mfa: true, status: "active" },
  { id: "5", name: "David Wilson", email: "david@company.com", role: "User", mfa: false, status: "inactive" },
];

const mockApps = [
  { id: "1", name: "Microsoft 365", publisher: "Microsoft", status: "enabled", users: 1247, risk: "low" },
  { id: "2", name: "Azure AD", publisher: "Microsoft", status: "enabled", users: 1247, risk: "low" },
  { id: "3", name: "SharePoint", publisher: "Microsoft", status: "enabled", users: 892, risk: "medium" },
  { id: "4", name: "Teams", publisher: "Microsoft", status: "enabled", users: 1134, risk: "low" },
  { id: "5", name: "OneDrive", publisher: "Microsoft", status: "enabled", users: 1056, risk: "medium" },
];

const mockPolicies = [
  { id: "1", name: "Conditional Access - MFA", type: "Access", enabled: true, users: 1247, compliance: 94 },
  { id: "2", name: "Password Expiration Policy", type: "Security", enabled: true, users: 1247, compliance: 87 },
  { id: "3", name: "Device Compliance", type: "Device", enabled: true, users: 892, compliance: 78 },
  { id: "4", name: "Data Loss Prevention", type: "Data", enabled: false, users: 0, compliance: 0 },
];

interface EnvironmentManagerProps {
  onBack: () => void;
}

export function EnvironmentManager({ onBack }: EnvironmentManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4 gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl mb-2">Environment Manager</h1>
              <p className="text-muted-foreground">
                Manage your Microsoft 365 tenant through Graph API
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white/5 border-white/10"
                />
              </div>
              <Button 
                className="gap-2 bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6]"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: "Total Users", value: "1,247", status: "active" },
            { icon: Cloud, label: "Active Apps", value: "24", status: "healthy" },
            { icon: Key, label: "Active Policies", value: "12", status: "active" },
            { icon: Shield, label: "Security Score", value: "89%", status: "good" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/[0.02] border-white/10 hover:bg-white/[0.05] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-5 h-5 text-[#0066ff]" />
                  <Badge variant="outline" className="border-green-500/50 text-green-400 bg-transparent text-xs">
                    {stat.status}
                  </Badge>
                </div>
                <p className="text-3xl mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white/[0.02] border border-white/10 p-1">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="apps" className="gap-2">
              <Cloud className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="policies" className="gap-2">
              <Shield className="w-4 h-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="devices" className="gap-2">
              <Lock className="w-4 h-4" />
              Devices
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="p-6 bg-white/[0.02] border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">User Accounts</h3>
                <Button className="gap-2 bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6]">
                  <Users className="w-4 h-4" />
                  Add User
                </Button>
              </div>

              <div className="space-y-3">
                {mockUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00d4ff] flex items-center justify-center">
                        <span>{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="border-white/20 bg-transparent">
                        {user.role}
                      </Badge>
                      {user.mfa ? (
                        <div className="flex items-center gap-1.5 text-green-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs">MFA</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-yellow-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">No MFA</span>
                        </div>
                      )}
                      <Badge 
                        variant="outline"
                        className={`${
                          user.status === 'active' 
                            ? 'border-green-500/50 text-green-400' 
                            : 'border-gray-500/50 text-gray-400'
                        } bg-transparent text-xs`}
                      >
                        {user.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="apps">
            <Card className="p-6 bg-white/[0.02] border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Enterprise Applications</h3>
                <Button className="gap-2 bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6]">
                  <Cloud className="w-4 h-4" />
                  Add Application
                </Button>
              </div>

              <div className="space-y-3">
                {mockApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066ff] to-[#00d4ff] flex items-center justify-center">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p>{app.name}</p>
                        <p className="text-sm text-muted-foreground">{app.publisher}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm">{app.users.toLocaleString()} users</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`${
                          app.risk === 'low' ? 'border-green-500/50 text-green-400' :
                          app.risk === 'medium' ? 'border-yellow-500/50 text-yellow-400' :
                          'border-red-500/50 text-red-400'
                        } bg-transparent text-xs`}
                      >
                        {app.risk} risk
                      </Badge>
                      <Badge 
                        variant="outline"
                        className="border-green-500/50 text-green-400 bg-transparent text-xs"
                      >
                        {app.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies">
            <Card className="p-6 bg-white/[0.02] border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Security Policies</h3>
                <Button className="gap-2 bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6]">
                  <Shield className="w-4 h-4" />
                  Create Policy
                </Button>
              </div>

              <div className="space-y-3">
                {mockPolicies.map((policy, index) => (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {policy.enabled ? (
                          <Unlock className="w-5 h-5 text-green-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <p>{policy.name}</p>
                          <p className="text-sm text-muted-foreground">{policy.type} Policy</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm">{policy.users.toLocaleString()} users</p>
                          <p className="text-xs text-muted-foreground">{policy.compliance}% compliant</p>
                        </div>
                        <Badge 
                          variant="outline"
                          className={`${
                            policy.enabled 
                              ? 'border-green-500/50 text-green-400' 
                              : 'border-gray-500/50 text-gray-400'
                          } bg-transparent text-xs`}
                        >
                          {policy.enabled ? 'enabled' : 'disabled'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices">
            <Card className="p-6 bg-white/[0.02] border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Managed Devices</h3>
                <Button className="gap-2 bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6]">
                  <Lock className="w-4 h-4" />
                  Enroll Device
                </Button>
              </div>

              <div className="text-center py-12">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Device management coming soon</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
