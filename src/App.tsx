import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";

import PatientDashboard from "./pages/PatientDashboard";
import LabDashboard from "./pages/LabDashboard";
import PhlebotomistDashboard from "./pages/PhlebotomistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LabManagement from "./pages/LabManagement";
import PhlebotomistManagement from "./pages/PhlebotomistManagement";
import PatientManagement from "./pages/PatientManagement";

import BookTest from "./pages/BookTest";
import ViewReports from "./pages/ViewReports";
import PatientMessages from "./pages/PatientMessages";
import LabMessages from "./pages/LabMessages";
import PhlebotomistMessages from "./pages/PhlebotomistMessages";
import LabAppointments from "./pages/LabAppointments";
import LabUploadReport from "./pages/LabUploadReport";
import LabTestSelection from "./pages/LabTestSelection";
import ChangePassword from "./pages/ChangePassword";
import PhlebotomistAppointments from "./pages/PhlebotomistAppointments";
import PhlebotomistSamples from "./pages/PhlebotomistSamples";

import { NotificationProvider } from "@/contexts/NotificationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* PATIENT ROUTES */}
              <Route
                path="/patient"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/messages"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <PatientMessages />
                  </ProtectedRoute>
                }
              />
              <Route path="/patient/book-test" element={<BookTest />} />
              <Route
                path="/patient/reports"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <ViewReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/change-password"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />

              {/* LAB ROUTES */}
              <Route
                path="/lab"
                element={
                  <ProtectedRoute allowedRole="lab">
                    <LabDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lab/messages"
                element={
                  <ProtectedRoute allowedRole="lab">
                    <LabMessages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lab/appointments"
                element={
                  <ProtectedRoute allowedRole="lab">
                    <LabAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lab/reports"
                element={
                  <ProtectedRoute allowedRole="lab">
                    <LabUploadReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lab/test-selection"
                element={
                  <ProtectedRoute allowedRole="lab">
                    <LabTestSelection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lab/change-password"
                element={
                  <ProtectedRoute allowedRole="lab">
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />

              {/* PHLEBOTOMIST ROUTES */}
              <Route
                path="/phlebotomist"
                element={
                  <ProtectedRoute allowedRole="phlebotomist">
                    <PhlebotomistDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/phlebotomist/appointments"
                element={
                  <ProtectedRoute allowedRole="phlebotomist">
                    <PhlebotomistAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/phlebotomist/samples"
                element={
                  <ProtectedRoute allowedRole="phlebotomist">
                    <PhlebotomistSamples />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/phlebotomist/messages"
                element={
                  <ProtectedRoute allowedRole="phlebotomist">
                    <PhlebotomistMessages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/phlebotomist/change-password"
                element={
                  <ProtectedRoute allowedRole="phlebotomist">
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />

              {/* ADMIN ROUTES */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/labs"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <LabManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/phlebotomists"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <PhlebotomistManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/patients"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <PatientManagement />
                  </ProtectedRoute>
                }
              />

              {/* 404 CATCH-ALL */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
