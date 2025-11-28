import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Navigation,
  TestTube,
  Route,
  User
} from "lucide-react";

const todaySchedule = [
  { id: 1, patient: "Sarah Wilson", address: "123 Oak Street, Apt 4B", time: "9:00 AM", test: "CBC", status: "Next", distance: "2.3 km" },
  { id: 2, patient: "Michael Chen", address: "456 Pine Avenue", time: "10:30 AM", test: "Lipid Panel", status: "Scheduled", distance: "3.1 km" },
  { id: 3, patient: "Emma Brown", address: "789 Maple Drive", time: "12:00 PM", test: "Glucose", status: "Scheduled", distance: "1.8 km" },
  { id: 4, patient: "Robert Lee", address: "321 Elm Street", time: "2:00 PM", test: "Thyroid", status: "Scheduled", distance: "4.2 km" },
];

const completedToday = [
  { id: 1, patient: "John Doe", time: "8:00 AM", test: "Complete Blood Count" },
  { id: 2, patient: "Jane Smith", time: "7:30 AM", test: "Blood Sugar Test" },
];

const PhlebotomistDashboard = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout role="phlebotomist">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">Good Morning, {user?.fullName?.split(' ')[0] || 'Phlebotomist'}!</h1>
        <p className="text-muted-foreground">Ready for today's sample collections</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Today's Collections"
          value="6"
          icon={Calendar}
          color="accent"
          delay={0}
        />
        <StatCard
          title="Completed"
          value="2"
          icon={CheckCircle2}
          color="success"
          delay={0.1}
        />
        <StatCard
          title="Remaining"
          value="4"
          icon={Clock}
          color="warning"
          delay={0.2}
        />
        <StatCard
          title="Total Distance"
          value="11.4 km"
          icon={Route}
          color="primary"
          delay={0.3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-border bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Today's Route</h2>
                <p className="text-sm text-muted-foreground">Sample collection schedule</p>
              </div>
              <Button>
                <Navigation className="mr-2 h-4 w-4" />
                Optimize Route
              </Button>
            </div>
            <div className="space-y-4">
              {todaySchedule.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group relative overflow-hidden rounded-lg border border-border bg-muted/30 p-4 transition-all hover:bg-muted/50 hover:shadow-soft"
                >
                  {appointment.status === "Next" && (
                    <div className="absolute right-0 top-0 h-full w-1 bg-accent" />
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{appointment.patient}</p>
                          {appointment.status === "Next" && (
                            <Badge variant="default" className="bg-accent text-accent-foreground">
                              Next
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {appointment.address}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <TestTube className="h-3 w-3" />
                              {appointment.test}
                            </div>
                            <div className="flex items-center gap-1">
                              <Route className="h-3 w-3" />
                              {appointment.distance}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        Start
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Completion Progress */}
          <Card className="border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-semibold text-foreground">Today's Progress</h3>
            <div className="mb-4">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-foreground">2</span>
                <span className="mb-1 text-sm text-muted-foreground">/ 6 completed</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "33%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-accent to-primary"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Great start! Keep up the excellent work.
            </p>
          </Card>

          {/* Completed Collections */}
          <Card className="border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-semibold text-foreground">Completed Today</h3>
            <div className="space-y-3">
              {completedToday.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 rounded-lg bg-success/10 p-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.patient}</p>
                    <p className="text-xs text-muted-foreground">{item.test}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-semibold text-foreground">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <TestTube className="mr-2 h-4 w-4" />
                Update Sample Status
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <MapPin className="mr-2 h-4 w-4" />
                View Map
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                View Full Schedule
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default PhlebotomistDashboard;

