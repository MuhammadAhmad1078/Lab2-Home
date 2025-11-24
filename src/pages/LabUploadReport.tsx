// src/pages/LabUploadReport.tsx
import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockReports = [
  {
    id: 1,
    patient: "Ali Raza",
    test: "CBC",
    date: "2025-11-24",
    file: "cbc_report.pdf",
  },
  {
    id: 2,
    patient: "Sara Khan",
    test: "Blood Sugar",
    date: "2025-11-24",
    file: "sugar_report.pdf",
  },
];

const LabUploadReport: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [patient, setPatient] = useState("");
  const [test, setTest] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Upload logic here (mock)
    setSelectedFile(null);
    setPatient("");
    setTest("");
    alert("Report uploaded!");
  };

  return (
    <DashboardLayout role="lab">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-12 px-2">
        <div className="max-w-2xl w-full mx-auto">
          <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100">
            <h2 className="text-3xl font-extrabold mb-8 text-blue-700 text-center drop-shadow">Upload Lab Report</h2>
            <Card className="p-6 mb-6 shadow-lg">
              <div className="flex flex-col gap-4 mb-4">
                <Input
                  value={patient}
                  onChange={e => setPatient(e.target.value)}
                  placeholder="Patient Name"
                  className="rounded-full"
                />
                <Input
                  value={test}
                  onChange={e => setTest(e.target.value)}
                  placeholder="Test Name"
                  className="rounded-full"
                />
                <Input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="rounded-full"
                />
                {selectedFile && (
                  <div className="text-xs text-muted-foreground">Selected: {selectedFile.name}</div>
                )}
                <Button onClick={handleUpload} disabled={!selectedFile || !patient || !test}>
                  Upload Report
                </Button>
              </div>
            </Card>
            <Card className="p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-primary">Uploaded Reports</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="px-4 py-2 text-left">Patient</th>
                      <th className="px-4 py-2 text-left">Test</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">File</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReports.map(r => (
                      <tr key={r.id} className="border-b">
                        <td className="px-4 py-2 font-semibold">{r.patient}</td>
                        <td className="px-4 py-2">{r.test}</td>
                        <td className="px-4 py-2">{r.date}</td>
                        <td className="px-4 py-2">
                          <a href="#" className="underline text-primary">{r.file}</a>
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

export default LabUploadReport;
