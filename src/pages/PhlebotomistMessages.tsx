// src/pages/PhlebotomistMessages.tsx
import React from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import ChatWindow from "@/components/chat/ChatWindow";

const PhlebotomistMessages: React.FC = () => {
  return (
    <DashboardLayout role="phlebotomist">
      <ChatWindow user="Phlebotomist" recipient="Patient" />
    </DashboardLayout>
  );
};

export default PhlebotomistMessages;
