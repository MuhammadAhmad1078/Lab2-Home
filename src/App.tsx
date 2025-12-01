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

import PatientDashboard from "./pages/PatientDashboard";
import LabDashboard from "./pages/LabDashboard";
import PhlebotomistDashboard from "./pages/PhlebotomistDashboard";

import BookTest from "./pages/BookTest";
import PatientMessages from "./pages/PatientMessages";
import LabMessages from "./pages/LabMessages";
import PhlebotomistMessages from "./pages/PhlebotomistMessages";
import LabAppointments from "./pages/LabAppointments";
import LabUploadReport from "./pages/LabUploadReport";
import LabTestSelection from "./pages/LabTestSelection";
const queryClient = new QueryClient();

import { NotificationProvider } from "@/contexts/NotificationContext";

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

              {/* PHLEBOTOMIST ROUTES */}
              <Route
                path="/phlebotomist"
                element={
                  <ProtectedRoute allowedRole="phlebotomist">
                    <PhlebotomistMessages />
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
