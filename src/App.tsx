
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

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes */}
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
              path="/phlebotomist"
              element={
                <ProtectedRoute allowedRole="phlebotomist">
                  <PhlebotomistDashboard />
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
            <Route path="/patient/book-test" element={<BookTest />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
