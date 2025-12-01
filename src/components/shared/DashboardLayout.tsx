import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  TestTube,
  FileText,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
  Activity,
  Users,
  Calendar,
  Building2
} from "lucide-react";
import NotificationBell from "./NotificationBell";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "patient" | "lab" | "phlebotomist" | "admin";
}

const roleConfig = {
  patient: {
    title: "Patient Portal",
    icon: Activity,
    color: "primary",
    nav: [
      { name: "Dashboard", path: "/patient", icon: LayoutDashboard },
      { name: "Book Test", path: "/patient/book-test", icon: TestTube },
      { name: "My Reports", path: "/patient/reports", icon: FileText },
      { name: "Marketplace", path: "/patient/marketplace", icon: ShoppingBag },
      { name: "Messages", path: "/patient/messages", icon: MessageSquare },
    ]
  },
  lab: {
    title: "Laboratory Portal",
    icon: Building2,
    color: "secondary",
    nav: [
      { name: "Dashboard", path: "/lab", icon: LayoutDashboard },
      { name: "Test Selection", path: "/lab/test-selection", icon: TestTube },
      { name: "Appointments", path: "/lab/appointments", icon: Calendar },
      { name: "Upload Reports", path: "/lab/reports", icon: FileText },
      { name: "Messages", path: "/lab/messages", icon: MessageSquare },
    ]
  },
  phlebotomist: {
    title: "Phlebotomist Portal",
    icon: Activity,
    color: "accent",
    nav: [
      { name: "Dashboard", path: "/phlebotomist", icon: LayoutDashboard },
      { name: "Appointments", path: "/phlebotomist/appointments", icon: Calendar },
      { name: "Sample Collection", path: "/phlebotomist/samples", icon: TestTube },
      { name: "Messages", path: "/phlebotomist/messages", icon: MessageSquare },
    ]
  },
  admin: {
    title: "Admin Portal",
    icon: Settings,
    color: "destructive",
    nav: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
      { name: "Manage Users", path: "/admin/users", icon: Users },
      { name: "Manage Labs", path: "/admin/labs", icon: Building2 },
      { name: "Marketplace", path: "/admin/marketplace", icon: ShoppingBag },
    ]
  }
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const config = roleConfig[role];
  const RoleIcon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card shadow-soft">
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex items-center gap-3 border-b border-border p-6">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              role === "patient" && "bg-primary/10 text-primary",
              role === "lab" && "bg-secondary/10 text-secondary",
              role === "phlebotomist" && "bg-accent/10 text-accent",
              role === "admin" && "bg-destructive/10 text-destructive"
            )}>
              <RoleIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Lab2Home</h2>
              <p className="text-xs text-muted-foreground">{config.title}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {config.nav.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative block"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="space-y-1 border-t border-border p-4">

            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-all hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-gray-50/50">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-border bg-background/80 px-8 backdrop-blur">
          <NotificationBell />
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

