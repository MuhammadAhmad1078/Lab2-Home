import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar as CalendarIcon, Phone, User, CheckCircle2, Navigation } from "lucide-react";

const mockAppointments = [
    {
        id: "APT-1001",
        patientName: "Sarah Wilson",
        testName: "CBC (Complete Blood Count)",
        date: "2024-03-20",
        time: "09:00 AM",
        address: "123 Oak Street, Apt 4B, Islamabad",
        phone: "0300-1234567",
        status: "scheduled",
        location: { lat: 33.6844, lng: 73.0479 }
    },
    {
        id: "APT-1002",
        patientName: "Michael Chen",
        testName: "Lipid Profile + LFT",
        date: "2024-03-20",
        time: "10:30 AM",
        address: "456 Pine Avenue, Blue Area, Islamabad",
        phone: "0301-9876543",
        status: "in-progress",
        location: { lat: 33.7077, lng: 73.0501 }
    },
    {
        id: "APT-1003",
        patientName: "Emma Brown",
        testName: "HbA1c",
        date: "2024-03-20",
        time: "12:00 PM",
        address: "789 Maple Drive, F-10, Islamabad",
        phone: "0321-4567890",
        status: "completed",
        location: { lat: 33.6938, lng: 73.0118 }
    }
];

const PhlebotomistAppointments = () => {
    const [filter, setFilter] = useState("all");

    const filteredAppointments = mockAppointments.filter(apt => {
        if (filter === "all") return true;
        return apt.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'default'; // dark/primary
            case 'in-progress': return 'warning';
            case 'completed': return 'success';
            default: return 'secondary';
        }
    };

    return (
        <DashboardLayout role="phlebotomist">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
                <p className="text-muted-foreground">Manage your home collection schedule</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {['all', 'scheduled', 'in-progress', 'completed'].map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? 'default' : 'outline'}
                        onClick={() => setFilter(f)}
                        className="capitalize"
                    >
                        {f.replace('-', ' ')}
                    </Button>
                ))}
            </div>

            <div className="grid gap-6">
                {filteredAppointments.map((apt, index) => (
                    <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-6 shadow-soft border-border">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                {/* Left Info */}
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <User className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{apt.patientName}</h3>
                                                <p className="text-sm text-muted-foreground">ID: {apt.id}</p>
                                            </div>
                                        </div>
                                        <Badge variant={getStatusColor(apt.status) as any} className="capitalize">
                                            {apt.status.replace('-', ' ')}
                                        </Badge>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <CalendarIcon className="h-4 w-4" />
                                            {apt.date} at {apt.time}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            {apt.phone}
                                        </div>
                                        <div className="flex items-start gap-2 text-muted-foreground col-span-2">
                                            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                            {apt.address}
                                        </div>
                                    </div>

                                    <div className="bg-muted p-3 rounded-lg">
                                        <span className="font-semibold text-sm">Test to Collect: </span>
                                        <span className="text-sm">{apt.testName}</span>
                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div className="flex flex-col gap-3 justify-center min-w-[150px]">
                                    {apt.status !== 'completed' && (
                                        <Button className="w-full gap-2">
                                            <Navigation className="h-4 w-4" />
                                            Navigate
                                        </Button>
                                    )}
                                    {apt.status === 'scheduled' && (
                                        <Button variant="outline" className="w-full gap-2">
                                            Start Trip
                                        </Button>
                                    )}
                                    {apt.status === 'in-progress' && (
                                        <Button variant="secondary" className="w-full gap-2 bg-success text-success-foreground hover:bg-success/90">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Mark Collected
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="w-full">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {filteredAppointments.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No appointments found in this category.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PhlebotomistAppointments;
