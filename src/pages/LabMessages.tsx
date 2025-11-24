// src/pages/LabMessages.tsx
import React from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import ChatWindow from "@/components/chat/ChatWindow";

const LabMessages: React.FC = () => {
  return (
    <DashboardLayout role="lab">
      <ChatWindow user="Lab" recipient="Patient" />
    </DashboardLayout>
  );
};

export default LabMessages;
