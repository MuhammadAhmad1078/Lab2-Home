import { useState, useEffect } from "react";
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
  Heart,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Booking {
  _id: string;
  test: {
    name: string;
    category: string;
  };
  lab: {
    labName: string;
  };
  bookingDate: string;
  preferredTimeSlot: string;
  status: string;
  totalAmount: number;
}

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    upcoming: 0
  });

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;

      try {
        const token = localStorage.getItem('lab2home_token');
        const response = await fetch(`http://localhost:5000/api/bookings/patient/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (data.success) {
          const fetchedBookings = data.data;
          setBookings(fetchedBookings);

          // Calculate stats
          const total = fetchedBookings.length;
          const completed = fetchedBookings.filter((b: Booking) => b.status === 'completed').length;
          const pending = fetchedBookings.filter((b: Booking) => b.status === 'pending').length;
          const upcoming = fetchedBookings.filter((b: Booking) =>
            ['pending', 'confirmed'].includes(b.status) && new Date(b.bookingDate) >= new Date()
          ).length;

          setStats({ total, completed, pending, upcoming });
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  if (loading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
          value={stats.total.toString()}
          icon={TestTube}
          color="primary"
          delay={0}
        />
        <StatCard
          title="Completed"
          value={stats.completed.toString()}
          change={stats.completed > 0 ? "Tests done" : "No tests yet"}
          trend="up"
          icon={FileCheck}
          color="success"
          delay={0.1}
        />
        <StatCard
          title="Pending"
          value={stats.pending.toString()}
          icon={Clock}
          color="warning"
          delay={0.2}
        />
        <StatCard
          title="Upcoming"
          value={stats.upcoming.toString()}
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
                <h2 className="text-xl font-semibold text-foreground">Recent Bookings</h2>
                <p className="text-sm text-muted-foreground">Your latest test appointments</p>
              </div>
              <Button onClick={() => navigate('/patient/book-test')}>
                <TestTube className="mr-2 h-4 w-4" />
                Book New Test
              </Button>
            </div>

            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No bookings found. Book your first test today!
                </div>
              ) : (
                bookings.slice(0, 3).map((booking, index) => (
                  <motion.div
                    key={booking._id}
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
                        <p className="font-semibold text-foreground">{booking.test?.name || 'Unknown Test'}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.bookingDate).toLocaleDateString()} at {booking.preferredTimeSlot}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{booking.lab?.labName}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize
                      ${booking.status === 'completed' ? 'bg-success/10 text-success' :
                        booking.status === 'pending' ? 'bg-warning/10 text-warning' :
                          booking.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                            'bg-primary/10 text-primary'}`}
                    >
                      {booking.status}
                    </span>
                  </motion.div>
                ))
              )}
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
                <span className="text-4xl font-bold text-foreground">--</span>
                <span className="mb-1 text-sm text-muted-foreground">/100</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "0%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-secondary to-primary"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete more tests to generate your health score.
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

      {/* Recent Reports - Placeholder for now as reports aren't implemented yet */}
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
          <div className="text-center py-6 text-muted-foreground">
            No reports available yet.
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
