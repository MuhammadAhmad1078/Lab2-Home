import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  TestTube, 
  FileCheck, 
  Clock, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Pill,
  Heart
} from "lucide-react";

const upcomingTests = [
  { id: 1, name: "Complete Blood Count", date: "Dec 25, 2025", time: "10:00 AM", status: "Scheduled" },
  { id: 2, name: "Lipid Panel", date: "Dec 27, 2025", time: "9:00 AM", status: "Pending" },
];

const recentReports = [
  { id: 1, name: "Blood Sugar Test", date: "Dec 20, 2025", status: "Available", alert: false },
  { id: 2, name: "Thyroid Function Test", date: "Dec 18, 2025", status: "Available", alert: true },
  { id: 3, name: "Liver Function Test", date: "Dec 15, 2025", status: "Available", alert: false },
];

const PatientDashboard = () => {
  const { user } = useAuth();
  
  console.log('🏥 PatientDashboard rendered, user:', user);
  console.log('👤 User role:', user?.role);
  console.log('🎯 User type:', user?.userType);
  
  return (
    <DashboardLayout role="patient">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user?.fullName?.split(' ')[0] || 'Patient'}!</h1>
        <p className="text-muted-foreground">Your health dashboard at a glance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Tests"
          value="24"
          icon={TestTube}
          color="primary"
          delay={0}
        />
        <StatCard
          title="Completed"
          value="21"
          change="+3 this month"
          trend="up"
          icon={FileCheck}
          color="success"
          delay={0.1}
        />
        <StatCard
          title="Pending"
          value="3"
          icon={Clock}
          color="warning"
          delay={0.2}
        />
        <StatCard
          title="Next Appointment"
          value="2 days"
          icon={Calendar}
          color="accent"
          delay={0.3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Tests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-border bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Upcoming Tests</h2>
                <p className="text-sm text-muted-foreground">Your scheduled appointments</p>
              </div>
              <Button>
                <TestTube className="mr-2 h-4 w-4" />
                Book New Test
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 transition-all hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <TestTube className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{test.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {test.date} at {test.time}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {test.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Health Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <Card className="border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-foreground">Health Score</h3>
            </div>
            <div className="mb-4">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-foreground">87</span>
                <span className="mb-1 text-sm text-muted-foreground">/100</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "87%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-secondary to-primary"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Great job! Your health metrics are looking good.
            </p>
          </Card>

          <Card className="border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Pill className="mr-2 h-4 w-4" />
                Order Medical Supplies
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileCheck className="mr-2 h-4 w-4" />
                View AI Insights
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Card className="border-border bg-card p-6 shadow-soft">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Reports</h2>
            <p className="text-sm text-muted-foreground">View and download your test results</p>
          </div>
          <div className="space-y-3">
            {recentReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-all hover:shadow-soft"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{report.name}</p>
                      {report.alert && (
                        <AlertCircle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button size="sm">Download</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
