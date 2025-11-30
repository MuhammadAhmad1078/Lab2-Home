// src/pages/BookTest.tsx
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TestTube,
  Clock,
  MapPin,
  Truck,
  HeartPulse,
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";
import TestBookingForm from "@/components/patient/TestBookingForm";
import { toast } from "sonner";
import { useLoadScript } from "@react-google-maps/api";

// Define types based on API response
export interface Test {
  _id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  preparationInstructions?: string;
  reportDeliveryTime: string;
  sampleType?: string;
}

export interface Lab {
  _id: string;
  labName: string;
  labAddress: string;
  rating?: number;
  distance?: string;
  logo?: string;
  availableTests: Test[];
  operatingHours?: {
    open: string;
    close: string;
  };
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

const BookTest: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/labs/available');
        const data = await response.json();

        if (data.success) {
          setLabs(data.data);
        } else {
          toast.error('Failed to fetch available labs');
        }
      } catch (error) {
        console.error('Error fetching labs:', error);
        toast.error('Error loading labs');
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  if (!isLoaded) {
    return (
      <DashboardLayout role="patient">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
        <StatCard title="Nearby Labs" value={labs.length.toString()} icon={MapPin} color="accent" delay={0.3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lab selection + Form */}
        <motion.div className="lg:col-span-2 space-y-6">

          {/* Select Lab */}
          <Card className="p-6 shadow-soft">
            <h2 className="font-semibold text-lg mb-4">1. Select Laboratory</h2>

            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : labs.length === 0 ? (
              <div className="flex items-center gap-3 p-4 border border-warning/50 bg-warning/10 rounded-lg text-warning">
                <AlertCircle className="h-5 w-5" />
                <p>No labs are currently available for booking.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {labs.map((lab) => (
                  <button
                    key={lab._id}
                    onClick={() => setSelectedLab(lab)}
                    className={`flex w-full p-4 gap-3 rounded-xl border shadow-sm transition text-left ${selectedLab?._id === lab._id
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/40"
                      }`}
                  >
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <TestTube className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{lab.labName}</p>
                      <p className="text-xs text-muted-foreground truncate">{lab.labAddress}</p>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          {lab.availableTests?.length || 0} Tests
                        </span>
                        <span>•</span>
                        <span>{lab.operatingHours?.open || '09:00'} - {lab.operatingHours?.close || '17:00'}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
            <ul className="text-sm text-muted-foreground mt-3 space-y-2">
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
