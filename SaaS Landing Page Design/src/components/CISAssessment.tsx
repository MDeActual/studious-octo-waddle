import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Shield, 
  TrendingUp,
  ArrowLeft,
  Download,
  Play
} from "lucide-react";
import { useState } from "react";

// Mock CIS v8 controls data
const cisControls = [
  {
    id: "1",
    title: "Inventory and Control of Enterprise Assets",
    description: "Actively manage all enterprise assets connected to the infrastructure",
    status: "passed",
    score: 95,
    findings: 2,
    priority: "high"
  },
  {
    id: "2",
    title: "Inventory and Control of Software Assets",
    description: "Actively manage all software on the network",
    status: "partial",
    score: 78,
    findings: 8,
    priority: "high"
  },
  {
    id: "3",
    title: "Data Protection",
    description: "Develop processes to identify and protect sensitive data",
    status: "passed",
    score: 92,
    findings: 3,
    priority: "critical"
  },
  {
    id: "4",
    title: "Secure Configuration",
    description: "Establish and maintain secure configurations",
    status: "partial",
    score: 72,
    findings: 12,
    priority: "high"
  },
  {
    id: "5",
    title: "Account Management",
    description: "Use processes and tools to assign access privileges",
    status: "failed",
    score: 58,
    findings: 18,
    priority: "critical"
  },
  {
    id: "6",
    title: "Access Control Management",
    description: "Use processes and tools to create and manage accounts",
    status: "partial",
    score: 81,
    findings: 6,
    priority: "medium"
  },
  {
    id: "7",
    title: "Continuous Vulnerability Management",
    description: "Develop a plan to assess and track vulnerabilities",
    status: "passed",
    score: 88,
    findings: 4,
    priority: "high"
  },
  {
    id: "8",
    title: "Audit Log Management",
    description: "Collect, alert, review, and retain audit logs",
    status: "partial",
    score: 75,
    findings: 9,
    priority: "medium"
  },
];

interface CISAssessmentProps {
  onBack: () => void;
}

export function CISAssessment({ onBack }: CISAssessmentProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedControl, setSelectedControl] = useState<string | null>(null);

  const overallScore = Math.round(
    cisControls.reduce((acc, control) => acc + control.score, 0) / cisControls.length
  );

  const statusCounts = {
    passed: cisControls.filter(c => c.status === 'passed').length,
    partial: cisControls.filter(c => c.status === 'partial').length,
    failed: cisControls.filter(c => c.status === 'failed').length,
  };

  const handleRunAssessment = () => {
    setIsRunning(true);
    // Simulate assessment running
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

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
              <h1 className="text-4xl mb-2">CIS v8 Security Assessment</h1>
              <p className="text-muted-foreground">
                Center for Internet Security Controls - Version 8
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button 
                onClick={handleRunAssessment}
                disabled={isRunning}
                className="gap-2 bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6]"
              >
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run Assessment'}
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 bg-gradient-to-br from-[#0066ff]/10 to-[#00d4ff]/10 border-[#0066ff]/20">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-[#0066ff]" />
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-4xl mb-2">{overallScore}%</p>
              <p className="text-sm text-muted-foreground">Overall Compliance Score</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-white/[0.02] border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <span className="text-2xl">{statusCounts.passed}</span>
              </div>
              <p className="text-sm text-muted-foreground">Controls Passed</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-white/[0.02] border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl">{statusCounts.partial}</span>
              </div>
              <p className="text-sm text-muted-foreground">Partial Compliance</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-white/[0.02] border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-400" />
                <span className="text-2xl">{statusCounts.failed}</span>
              </div>
              <p className="text-sm text-muted-foreground">Controls Failed</p>
            </Card>
          </motion.div>
        </div>

        {/* Controls List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white/[0.02] border-white/10">
            <h3 className="text-xl mb-6">Control Assessment Details</h3>
            
            <div className="space-y-4">
              {cisControls.map((control, index) => (
                <motion.div
                  key={control.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    selectedControl === control.id
                      ? 'bg-white/[0.08] border-[#0066ff]/50'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                  }`}
                  onClick={() => setSelectedControl(selectedControl === control.id ? null : control.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {control.status === 'passed' && (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      )}
                      {control.status === 'partial' && (
                        <AlertCircle className="w-6 h-6 text-yellow-400" />
                      )}
                      {control.status === 'failed' && (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm text-muted-foreground">Control {control.id}</span>
                            <Badge 
                              variant="outline"
                              className={`${
                                control.priority === 'critical' ? 'border-red-500/50 text-red-400' :
                                control.priority === 'high' ? 'border-orange-500/50 text-orange-400' :
                                'border-blue-500/50 text-blue-400'
                              } bg-transparent text-xs`}
                            >
                              {control.priority}
                            </Badge>
                          </div>
                          <h4 className="mb-1">{control.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {control.description}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl mb-1">{control.score}%</div>
                          <div className="text-xs text-muted-foreground">
                            {control.findings} findings
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Progress value={control.score} className="h-2" />
                      </div>

                      {selectedControl === control.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <h5 className="text-sm mb-3">Recommended Actions</h5>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5" />
                              <span>Enable multi-factor authentication for all administrative accounts</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5" />
                              <span>Review and update access control policies quarterly</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5" />
                              <span>Implement automated compliance monitoring</span>
                            </div>
                          </div>
                          <Button 
                            className="mt-4 gap-2 bg-gradient-to-r from-[#0066ff] to-[#00d4ff] hover:from-[#0052cc] hover:to-[#00b8e6]"
                            size="sm"
                          >
                            Auto-Remediate
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
