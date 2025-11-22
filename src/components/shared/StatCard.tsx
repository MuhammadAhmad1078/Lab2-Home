import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "primary" | "secondary" | "accent" | "success" | "warning";
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = "neutral",
  color = "primary",
  delay = 0 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-medium"
    >
      {/* Background Gradient Glow */}
      <div className={cn(
        "absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl transition-opacity opacity-0 group-hover:opacity-20",
        color === "primary" && "bg-primary",
        color === "secondary" && "bg-secondary",
        color === "accent" && "bg-accent",
        color === "success" && "bg-success",
        color === "warning" && "bg-warning"
      )} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <span className={cn(
                "text-sm font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground"
              )}>
                {trend === "up" && "↑"}
                {trend === "down" && "↓"}
                {change}
              </span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
          color === "primary" && "bg-primary/10 text-primary",
          color === "secondary" && "bg-secondary/10 text-secondary",
          color === "accent" && "bg-accent/10 text-accent",
          color === "success" && "bg-success/10 text-success",
          color === "warning" && "bg-warning/10 text-warning"
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

