// src/pages/BookTest.tsx
import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TestTube,
  Calendar,
  Clock,
  MapPin,
  Truck,
  HeartPulse,
  Star,
} from "lucide-react";
import TestBookingForm from "@/components/patient/TestBookingForm";

type Lab = {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  logo: string;
  tests: number[];  // IDs of tests available
  slots: string[];  // Times available
};

const labs: Lab[] = [
  {
    id: "lab-1",
    name: "Chughtai Lab",
    address: "Gulberg III, Lahore",
    rating: 4.8,
    distance: "2.1 km",
    logo: "/labs/chughtai.png",
    tests: [1, 2, 3, 4],
    slots: ["09:00 AM", "11:00 AM", "03:00 PM"],
  },
  {
    id: "lab-2",
    name: "Shaukat Khanum Lab",
    address: "Johar Town, Lahore",
    rating: 4.7,
    distance: "3.5 km",
    logo: "/labs/shaukat-khanum.png",
    tests: [1, 5, 7],
    slots: ["10:00 AM", "01:00 PM", "04:00 PM"],
  },
  {
    id: "lab-3",
    name: "Excel Diagnostics",
    address: "Model Town, Lahore",
    rating: 4.6,
    distance: "4.0 km",
    logo: "/labs/excel-diagnostics.png",
    tests: [2, 3, 6, 8],
    slots: ["09:30 AM", "12:00 PM", "05:00 PM"],
  },
];

const BookTest: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  return (
    <DashboardLayout role="patient">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Book a Diagnostic Test</h1>
        <p className="text-muted-foreground">Choose a laboratory first to continue.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Available Tests" value="35+" icon={TestTube} color="primary" delay={0} />
        <StatCard title="Home Collections" value="18" change="Today" trend="up" icon={Truck} color="success" delay={0.1} />
        <StatCard title="Next Free Slot" value="Today, 4:00 PM" icon={Clock} color="warning" delay={0.2} />
        <StatCard title="Nearby Labs" value="4" icon={MapPin} color="accent" delay={0.3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lab selection + Form */}
        <motion.div className="lg:col-span-2 space-y-6">

          {/* Select Lab */}
          <Card className="p-6 shadow-soft">
            <h2 className="font-semibold text-lg mb-4">1. Select Laboratory</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {labs.map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLab(lab)}
                  className={`flex w-full p-4 gap-3 rounded-xl border shadow-sm transition ${
                    selectedLab?.id === lab.id
                      ? "border-primary bg-primary/10"
                      : "hover:border-primary/40"
                  }`}
                >
                  <img src={lab.logo} className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <p className="font-semibold">{lab.name}</p>
                    <p className="text-xs text-muted-foreground">{lab.address}</p>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      ⭐ {lab.rating} • 📍 {lab.distance}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Test Form */}
          <Card className="p-6 shadow-soft">
            <TestBookingForm selectedLab={selectedLab} />
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div className="space-y-6">
          <Card className="p-6 shadow-soft">
            <h3 className="font-semibold flex gap-2">
              <HeartPulse className="h-5 w-5 text-secondary" /> Why Home Collection?
            </h3>
            <ul className="text-sm text-muted-foreground mt-3">
              <li>• Avoid long queues</li>
              <li>• Safer for elderly</li>
              <li>• Digital Reports</li>
              <li>• Fast & reliable</li>
            </ul>
          </Card>

          <Card className="p-6 shadow-soft">
            <h3 className="font-semibold flex gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Coming Slots
            </h3>
            <div className="mt-3 space-y-2 text-sm">
              <p className="p-2 bg-muted/40 rounded-lg flex justify-between">
                Today 4 PM <span className="text-primary text-xs">Fastest</span>
              </p>
              <p className="p-2 bg-muted/20 rounded-lg">Today 7:30 PM</p>
              <p className="p-2 bg-muted/20 rounded-lg">Tomorrow 9 AM</p>
            </div>
            <Button className="mt-4 w-full">View all slots</Button>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default BookTest;
