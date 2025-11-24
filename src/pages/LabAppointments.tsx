// src/pages/LabAppointments.tsx
import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockAppointments = [
  {
    id: 1,
    patient: "Ali Raza",
    date: "2025-11-24",
    time: "10:00 AM",
    test: "CBC",
    status: "Pending",
  },
  {
    id: 2,
    patient: "Sara Khan",
    date: "2025-11-24",
    time: "11:30 AM",
    test: "Blood Sugar",
    status: "Completed",
  },
];

const LabAppointments: React.FC = () => {
  const [search, setSearch] = useState("");
  const filtered = mockAppointments.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.test.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="lab">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-12 px-2">
        <div className="max-w-3xl w-full mx-auto">
          <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100">
            <h2 className="text-3xl font-extrabold mb-8 text-blue-700 text-center drop-shadow">Lab Appointments</h2>
            <Card className="p-6 mb-6 shadow-lg">
              <div className="flex gap-4 mb-4">
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by patient or test"
                  className="flex-1 rounded-full"
                />
                <Button>Filter</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="px-4 py-2 text-left">Patient</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Test</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(a => (
                      <tr key={a.id} className="border-b">
                        <td className="px-4 py-2 font-semibold">{a.patient}</td>
                        <td className="px-4 py-2">{a.date}</td>
                        <td className="px-4 py-2">{a.time}</td>
                        <td className="px-4 py-2">{a.test}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${a.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <Button size="sm" variant="outline">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LabAppointments;
