// src/pages/PatientMessages.tsx
import React from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import ChatWindow from "@/components/chat/ChatWindow";

const PatientMessages: React.FC = () => {
  // You can fetch recipient info from context or props if needed
  return (
    <DashboardLayout role="patient">
      <ChatWindow user="Patient" recipient="Lab" />
    </DashboardLayout>
  );
};

export default PatientMessages;
