// src/pages/LabUploadReport.tsx
import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  FileUp,
  FileText,
  Calendar,
  Search,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";

// =============================================================
// ⭐ TYPES (Fully Typed – No ANY)
// =============================================================
type Patient = {
  id: string;
  name: string;
  dob: string;
  address: string;
  gender: "Male" | "Female" | "Other";
};


type ReportStatus = "Delivered" | "Pending Review";

interface Report {
  id: number;
  patientId: string;
  patient: Patient;
  test: string;
  date: string;
  file: string;
  status: ReportStatus;
}

// =============================================================
// ⭐ MOCK PATIENT DATABASE
// =============================================================
const mockPatients: Record<string, Patient> = {
  "001": {
    id: "001",
    name: "Ali Raza",
    dob: "1995-05-12",
    address: "Model Town, Lahore",
    gender: "Male",
  },
  "002": {
    id: "002",
    name: "Sara Khan",
    dob: "1998-09-20",
    address: "Gulberg II, Lahore",
    gender: "Female",
  },
};


// =============================================================
// ⭐ INITIAL REPORTS
// =============================================================
const initialReports: Report[] = [
  {
    id: 1,
    patientId: "001",
    patient: mockPatients["001"],
    test: "CBC",
    date: "2025-11-24",
    file: "cbc_report.pdf",
    status: "Delivered",
  },
  {
    id: 2,
    patientId: "002",
    patient: mockPatients["002"],
    test: "Blood Sugar",
    date: "2025-11-24",
    file: "sugar_report.pdf",
    status: "Pending Review",
  },
];

// =============================================================
// ⭐ COMPONENT START
// =============================================================
export default function LabUploadReport() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [search, setSearch] = useState("");

  // Upload Form States
  const [patientId, setPatientId] = useState("");
  const [patientInfo, setPatientInfo] = useState<Patient | null>(null);
  const [testName, setTestName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Edit Modal States
  const [editModal, setEditModal] = useState(false);
  const [editReport, setEditReport] = useState<Report | null>(null);

  // View Modal
  const [viewModal, setViewModal] = useState(false);
  const [viewFile, setViewFile] = useState("");

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);

  // =============================================================
  // ⭐ Handle Patient Auto-Fill
  // =============================================================
  const handlePatientIdLookup = (id: string) => {
    setPatientId(id);
    setPatientInfo(mockPatients[id] ?? null);
  };

  // =============================================================
  // ⭐ Validate File
  // =============================================================
  const validateFile = (file: File) => {
    if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
      alert("Only PDF, PNG, and JPG files allowed!");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Max file size is 10MB!");
      return false;
    }
    return true;
  };

  // =============================================================
  // ⭐ Upload New Report
  // =============================================================
  const handleUpload = () => {
    if (!patientId || !patientInfo || !testName || !selectedFile) {
      alert("Please complete all fields.");
      return;
    }

    const newReport: Report = {
      id: reports.length + 1,
      patientId,
      patient: patientInfo,
      test: testName,
      file: selectedFile.name,
      status: "Pending Review",
      date: new Date().toISOString().slice(0, 10),
    };

    setReports([...reports, newReport]);

    setPatientId("");
    setPatientInfo(null);
    setTestName("");
    setSelectedFile(null);
  };

  // =============================================================
  // ⭐ View Modal
  // =============================================================
  const openView = (fileName: string) => {
    setViewFile(fileName);
    setViewModal(true);
  };

  // =============================================================
  // ⭐ Edit Modal
  // =============================================================
  const openEdit = (report: Report) => {
    setEditReport({ ...report });
    setEditModal(true);
  };

  const saveEdit = () => {
    if (!editReport) return;
    setReports((p) => p.map((r) => (r.id === editReport.id ? editReport : r)));
    setEditModal(false);
  };

  // =============================================================
  // ⭐ Delete Report
  // =============================================================
  const deleteReportAction = () => {
    if (!deleteTarget) return;
    setReports((p) => p.filter((r) => r.id !== deleteTarget.id));
    setDeleteModal(false);
  };

  // =============================================================
  // ⭐ Filter Reports by Patient ID
  // =============================================================
  const filteredReports = reports.filter((r) =>
    r.patientId.includes(search.trim())
  );

  // =============================================================
  // ⭐ UI START
  // =============================================================
  return (
    <DashboardLayout role="lab">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Upload Reports</h1>
        <p className="text-muted-foreground">
          Manage uploaded lab reports and patient details.
        </p>
      </motion.div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 my-8">
        <StatCard title="Total Reports" value={reports.length.toString()} icon={FileText} color="primary" />
        <StatCard title="Uploaded Today" value="14" change="+5 vs yesterday" icon={FileUp} color="success" />
        <StatCard
          title="Pending Review"
          value={reports.filter((r) => r.status !== "Delivered").length.toString()}
          icon={AlertCircle}
          color="warning"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* UPLOAD FORM */}
        <Card className="p-6 shadow-soft">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileUp className="h-5 w-5 text-primary" /> Upload New Report
          </h2>

          <div className="space-y-4">
            {/* PATIENT ID */}
            <div>
              <label className="text-xs font-medium">Patient ID</label>
              <Input
                value={patientId}
                onChange={(e) => handlePatientIdLookup(e.target.value)}
                placeholder="Enter Patient ID"
              />
            </div>

            {/* AUTO-FILL PATIENT INFO */}
            {patientInfo && (
              <Card className="p-3 border bg-muted/40">
                <p className="font-medium">{patientInfo.name}</p>
                <p className="text-xs">DOB: {patientInfo.dob}</p>
                <p className="text-xs">Address: {patientInfo.address}</p>
                <p className="text-xs">Gender: {patientInfo.gender}</p>
              </Card>

            )}

            {/* TEST NAME */}
            <div>
              <label className="text-xs font-medium">Test Name</label>
              <Input
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="CBC / Lipid Panel / etc"
              />
            </div>

            {/* FILE UPLOAD */}
            <div>
              <label className="text-xs font-medium">Report File</label>
              <Input
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                onChange={(e) => {
                  if (!e.target.files) return;
                  const file = e.target.files[0];
                  if (validateFile(file)) setSelectedFile(file);
                }}
              />
            </div>

            <Button
              className="w-full"
              disabled={!patientInfo || !testName || !selectedFile}
              onClick={handleUpload}
            >
              <FileUp className="h-4 w-4 mr-2" /> Upload Report
            </Button>
          </div>
        </Card>

        {/* REPORTS TABLE */}
        <Card className="lg:col-span-2 p-6 shadow-soft">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Uploaded Reports</h2>

            {/* Search by Patient ID */}
            <div className="flex items-center gap-2 border rounded-full px-3 py-1 bg-muted/20">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Patient ID"
                className="border-none bg-transparent h-8 w-32"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">Patient</th>
                  <th className="px-4 py-2 text-left">Test</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">File</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center">
                      No reports found.
                    </td>
                  </tr>
                )}

                {filteredReports.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-muted/20">
                    {/* PATIENT INFO */}
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.patient.name}</div>
                      <div className="text-xs">ID: {r.patientId}</div>
                      <div className="text-xs">DOB: {r.patient.dob}</div>
                      <div className="text-xs">Gender: {r.patient.gender}</div>

                      <div className="text-xs">Address: {r.patient.address}</div>
                    </td>

                    {/* TEST */}
                    <td className="px-4 py-3">{r.test}</td>

                    {/* DATE */}
                    <td className="px-4 py-3 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {r.date}
                    </td>

                    {/* FILE */}
                    <td className="px-4 py-3">
                      <button className="text-primary underline">{r.file}</button>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          r.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        
                        {/* VIEW */}
                        <Button
                          variant="outline"
                          className="h-7 px-2 text-xs flex items-center"
                          onClick={() => openView(r.file)}
                        >
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>

                        {/* EDIT */}
                        <Button
                          className="h-7 px-2 text-xs flex items-center"
                          onClick={() => openEdit(r)}
                        >
                          <Pencil className="h-3 w-3 mr-1" /> Edit
                        </Button>

                        {/* DELETE */}
                        <Button
                          variant="destructive"
                          className="h-7 px-2 text-xs flex items-center"
                          onClick={() => {
                            setDeleteTarget(r);
                            setDeleteModal(true);
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* =========================================================
         ⭐ VIEW MODAL
         ========================================================= */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-[600px] p-6 bg-white rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" /> Report Preview
              </h2>
              <Button variant="ghost" onClick={() => setViewModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="border rounded-lg bg-muted/20 p-3 h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground text-sm text-center">
                File preview will appear here (PDF / Image).
                <br />
                <span className="font-medium">{viewFile}</span>
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* =========================================================
         ⭐ EDIT MODAL
         ========================================================= */}
      {editModal && editReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <Card className="w-[450px] bg-white p-6 rounded-xl shadow-xl">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Pencil className="h-5 w-5 text-primary" /> Edit Report
              </h2>
              <Button variant="ghost" onClick={() => setEditModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4 mt-4">

              {/* PATIENT (read-only) */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Patient</p>
                <Input value={editReport.patient.name} disabled />
              </div>

              {/* TEST NAME */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Test Name</p>
                <Input
                  value={editReport.test}
                  onChange={(e) =>
                    setEditReport({ ...editReport, test: e.target.value })
                  }
                />
              </div>

              {/* STATUS */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Status</p>
                <Input
                  value={editReport.status}
                  onChange={(e) =>
                    setEditReport({
                      ...editReport,
                      status: e.target.value as ReportStatus,
                    })
                  }
                />
              </div>

              {/* Replace File */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Replace File (optional)
                </p>
                <Input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const file = e.target.files[0];
                    if (validateFile(file)) {
                      setEditReport({ ...editReport, file: file.name });
                    }
                  }}
                />
                <p className="text-xs mt-1 text-muted-foreground">
                  Current: {editReport.file}
                </p>
              </div>

              <Button className="w-full" onClick={saveEdit}>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>

          </Card>
        </div>
      )}

      {/* =========================================================
         ⭐ DELETE MODAL
         ========================================================= */}
      {deleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <Card className="w-[380px] bg-white p-6 rounded-xl shadow-xl animate-in fade-in zoom-in-95">

            <div className="flex gap-3 items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-lg font-semibold">Delete Report?</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this report for{" "}
              <span className="font-semibold">{deleteTarget.patient.name}</span>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={deleteReportAction}>
                Delete
              </Button>
            </div>

          </Card>
        </div>
      )}

    </DashboardLayout>
  );
}
