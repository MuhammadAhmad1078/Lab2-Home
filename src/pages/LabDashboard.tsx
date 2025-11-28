import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar,
  FileUp,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Upload
} from "lucide-react";

const pendingReports = [
  { id: 1, patient: "Sarah Wilson", test: "Complete Blood Count", collected: "2 hours ago", priority: "High" },
  { id: 2, patient: "Michael Chen", test: "Lipid Panel", collected: "5 hours ago", priority: "Normal" },
  { id: 3, patient: "Emma Brown", test: "Thyroid Test", collected: "1 day ago", priority: "High" },
];

const todayAppointments = [
  { id: 1, patient: "John Doe", time: "10:00 AM", test: "Blood Sugar", status: "Completed" },
  { id: 2, patient: "Jane Smith", time: "11:30 AM", test: "Liver Function", status: "In Progress" },
  { id: 3, patient: "Robert Johnson", time: "2:00 PM", test: "Kidney Function", status: "Scheduled" },
  { id: 4, patient: "Lisa Anderson", time: "3:30 PM", test: "Complete Blood Count", status: "Scheduled" },
];

const LabDashboard = () => {
  const navigate = useNavigate();      // from feature branch
  const { user } = useAuth();          // from main branch

  return (
    <DashboardLayout role="lab">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {user?.labName || "Laboratory"} Dashboard
        </h1>
        <p className="text-muted-foreground">Manage tests, reports, and appointments</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Today's Appointments"
          value="12"
          icon={Calendar}
          color="secondary"
          delay={0}
        />
        <StatCard
          title="Pending Reports"
          value="8"
          change="-2 from yesterday"
          trend="down"
          icon={FileUp}
          color="warning"
          delay={0.1}
        />
        <StatCard
          title="Active Patients"
          value="156"
          change="+12 this week"
          trend="up"
          icon={Users}
          color="primary"
          delay={0.2}
        />
        <StatCard
          title="Completion Rate"
          value="94%"
          change="+2%"
          trend="up"
          icon={TrendingUp}
          color="success"
          delay={0.3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Reports Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-border bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Pending Report Uploads</h2>
                <p className="text-sm text-muted-foreground">Tests awaiting results submission</p>
              </div>
              <Button onClick={() => navigate("/lab/reports")}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Report
              </Button>
            </div>

            <div className="space-y-4">
              {pendingReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <FileUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{report.patient}</p>
                      <p className="text-sm text-muted-foreground">{report.test}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Collected {report.collected}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={report.priority === "High" ? "destructive" : "secondary"}>
                      {report.priority}
                    </Badge>
                    <Button size="sm">Upload</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <Card className="border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-semibold text-foreground">Today's Overview</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
                <span className="font-semibold text-foreground">8</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-sm text-muted-foreground">In Progress</span>
                </div>
                <span className="font-semibold text-foreground">2</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Scheduled</span>
                </div>
                <span className="font-semibold text-foreground">4</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-muted-foreground">Cancelled</span>
                </div>
                <span className="font-semibold text-foreground">1</span>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-semibold text-foreground">Performance</h3>

            <div className="space-y-3">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Report Turnaround</span>
                  <span className="font-medium text-foreground">4.2h avg</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-full bg-secondary"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Quality Score</span>
                  <span className="font-medium text-foreground">96%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "96%" }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="h-full bg-success"
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Today's Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Card className="border-border bg-card p-6 shadow-soft">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Today's Appointments</h2>
            <p className="text-sm text-muted-foreground">Scheduled sample collections and tests</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {todayAppointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:shadow-soft"
              >
                <div>
                  <p className="font-medium text-foreground">{apt.patient}</p>
                  <p className="text-sm text-muted-foreground">{apt.test}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {apt.time}
                  </div>
                </div>
                <Badge 
                  variant={
                    apt.status === "Completed" ? "default" :
                    apt.status === "In Progress" ? "secondary" :
                    "outline"
                  }
                >
                  {apt.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default LabDashboard;
