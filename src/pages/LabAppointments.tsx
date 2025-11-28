// src/pages/LabAppointments.tsx
import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Calendar,
  User,
  Phone,
  MapPin,
  FileText,
  Clock,
  Hash,
  Eye,
  Pencil,
  Trash2,
  Filter,
  CheckCircle2,
} from "lucide-react";

type AppointmentStatus = "Pending" | "Completed" | "Cancelled";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  phone: string;
  address: string;
  test: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

const initialAppointments: Appointment[] = [
  {
    id: "APPT-00123",
    patientName: "Ali Raza",
    patientId: "001",
    phone: "0301-1234567",
    address: "Model Town, Lahore",
    test: "Complete Blood Count (CBC)",
    date: "2025-11-28",
    time: "10:00 AM",
    status: "Pending",
    notes: "",
  },
  {
    id: "APPT-00124",
    patientName: "Sara Khan",
    patientId: "002",
    phone: "0322-8877665",
    address: "Gulberg II, Lahore",
    test: "Lipid Profile",
    date: "2025-11-28",
    time: "11:30 AM",
    status: "Completed",
    notes: "",
  },
];

type Props = {
  insidePreview?: boolean;
};

const LabAppointments: React.FC<Props> = ({ insidePreview }) => {
  const Wrapper = (insidePreview ? React.Fragment : DashboardLayout) as React.ElementType;

  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">("All");

  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [deleting, setDeleting] = useState<Appointment | null>(null);

  const totalAppointments = appointments.length;
  const completedToday = appointments.filter((a) => a.status === "Completed").length;
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;

  const filteredAppointments = appointments.filter((a) => {
    const term = search.toLowerCase().trim();
    const searchMatch =
      !term ||
      a.patientId.toLowerCase().includes(term) ||
      a.id.toLowerCase().includes(term);

    const statusMatch = statusFilter === "All" || a.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const updateAppointment = (updated: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Wrapper role="lab">
      <div className="w-full px-4 py-6 space-y-6">
        
        {/* HEADER */}
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track appointments.
        </p>

        {/* STATS */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="Total Appointments"
            value={totalAppointments.toString()}
            icon={Calendar}
            color="primary"
          />
          <StatCard
            title="Completed Today"
            value={completedToday.toString()}
            icon={CheckCircle2}
            color="success"
          />
          <StatCard
            title="Pending"
            value={pendingCount.toString()}
            icon={Clock}
            color="warning"
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[2.3fr,1.2fr]">

          {/* APPOINTMENT CARD */}
          <Card className="p-5 shadow-sm border">
            
            {/* FILTER BAR */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 w-full md:w-1/2 border rounded-full px-3 bg-muted/40">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Patient ID or Appointment ID..."
                  className="border-none bg-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as AppointmentStatus | "All")
                }
                className="text-xs px-3 py-1 border bg-background rounded-full"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* APPOINTMENTS LIST */}
            <div className="space-y-4">
              {filteredAppointments.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 border shadow-sm hover:shadow-md transition"
                >
                  
                  {/* TOP ROW */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                        {item.id}
                      </span>
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          {item.patientName}
                          <span className="text-[11px] text-muted-foreground">
                            (PID: {item.patientId})
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {item.test}
                        </p>
                      </div>
                    </div>

                    <Badge
                      className={
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>

                  {/* DETAILS */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mt-3">
                    <div className="flex gap-2 items-center">
                      <Phone className="h-3 w-3 text-primary" /> {item.phone}
                    </div>
                    <div className="flex gap-2 items-center truncate">
                      <MapPin className="h-3 w-3 text-primary" /> {item.address}
                    </div>
                    <div className="flex gap-2 items-center">
                      <Calendar className="h-3 w-3 text-primary" /> {item.date}
                    </div>
                    <div className="flex gap-2 items-center">
                      <Clock className="h-3 w-3 text-primary" /> {item.time}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => setViewing(item)}>
                      <Eye className="h-3 w-3" /> View
                    </Button>
                    <Button size="sm" onClick={() => setEditing(item)}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleting(item)}
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

          </Card>

          {/* SIDE CARDS */}
          <div className="space-y-4">
            <Card className="p-4 shadow-sm">
              <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Today's Summary
              </h3>
              <p className="text-xs">{completedToday} completed today.</p>
              <p className="text-xs">{pendingCount} pending.</p>
            </Card>

            <Card className="p-4 shadow-sm">
              <h3 className="font-semibold mb-2 text-sm">Notes</h3>
              <p className="text-xs text-muted-foreground">
                Keep appointments updated for accurate dashboards.
              </p>
            </Card>
          </div>
        </div>

        {/* VIEW MODAL */}
        {viewing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <Card className="w-[460px] bg-white p-6 rounded-xl shadow-xl">
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  Appointment Details
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setViewing(null)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-3 text-sm">
                <p><strong>Patient:</strong> {viewing.patientName}</p>
                <p><strong>Patient ID:</strong> {viewing.patientId}</p>
                <p><strong>Test:</strong> {viewing.test}</p>
                <p><strong>Date:</strong> {viewing.date}</p>
                <p><strong>Time:</strong> {viewing.time}</p>
                <p><strong>Phone:</strong> {viewing.phone}</p>
                <p><strong>Address:</strong> {viewing.address}</p>
                {viewing.notes && (
                  <p><strong>Notes:</strong> {viewing.notes}</p>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setViewing(null)}>
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* EDIT MODAL */}
        {editing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <Card className="w-[520px] bg-white p-6 rounded-xl shadow-xl">

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-primary" />
                  Edit Appointment
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setEditing(null)}>
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* READ-ONLY FIELDS */}
                <div>
                  <p className="text-xs text-muted-foreground">Patient Name</p>
                  <Input value={editing.patientName} disabled />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Patient ID</p>
                  <Input value={editing.patientId} disabled />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <Input value={editing.phone} disabled />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <Input value={editing.address} disabled />
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Test (Read-Only)</p>
                  <Input value={editing.test} disabled />
                </div>

                {/* EDITABLE FIELDS NOW */}
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <Input
                    type="date"
                    value={editing.date}
                    onChange={(e) =>
                      setEditing({ ...editing, date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <Input
                    value={editing.time}
                    onChange={(e) =>
                      setEditing({ ...editing, time: e.target.value })
                    }
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <select
                    value={editing.status}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        status: e.target.value as AppointmentStatus,
                      })
                    }
                    className="border rounded-md px-2 py-2 text-xs bg-background"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <Input
                    placeholder="Optional note..."
                    value={editing.notes || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, notes: e.target.value })
                    }
                  />
                </div>

              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    updateAppointment(editing);
                    setEditing(null);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* DELETE MODAL */}
        {deleting && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <Card className="w-[380px] bg-white p-6 rounded-xl shadow-xl">
              
              <h2 className="text-lg font-semibold mb-2">Delete Appointment?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete appointment{" "}
                <strong>{deleting.id}</strong> for{" "}
                <strong>{deleting.patientName}</strong>? This cannot be undone.
              </p>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setDeleting(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    deleteAppointment(deleting.id);
                    setDeleting(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        )}

      </div>
    </Wrapper>
  );
};

export default LabAppointments;
