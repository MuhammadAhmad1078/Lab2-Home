import React, { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  MessageCircle,
  Clock,
  FileCheck,
  MessageSquare,
} from "lucide-react";

type Message = {
  from: "me" | "patient" | "phlebotomist" | "support";
  text: string;
  time: string;
  read?: boolean;
};

const recipientOptions = [
  { id: "patient", label: "Patient" },
  { id: "phlebotomist", label: "Phlebotomist" },
  { id: "support", label: "Help / Support" },
];

const LabMessages = () => {
  const [selectedChat, setSelectedChat] = useState("patient");

  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    patient: [
      { from: "patient", text: "Is fasting needed?", time: "09:01 AM" },
      { from: "me", text: "Yes, please fast 8 hours.", time: "09:03 AM", read: true },
    ],
    phlebotomist: [
      { from: "phlebotomist", text: "Should I pick sample from Gulberg?", time: "08:20 AM" },
      { from: "me", text: "Yes, add it to schedule.", time: "08:22 AM", read: true },
    ],
    support: [
      { from: "support", text: "How can we assist your lab?", time: "08:00 AM" },
    ],
  });

  const messages = chatHistory[selectedChat];
  const [input, setInput] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight), [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setChatHistory(prev => ({
      ...prev,
      [selectedChat]: [...prev[selectedChat], { from: "me", text: input, time: "Now" }],
    }));
    setInput("");
  };

  return (
    <DashboardLayout role="lab">
      <div className="flex flex-col gap-6 h-[calc(100vh-80px)]">

        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with patients and phlebotomists regarding tests and reports.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-full">

          {/* CHAT PANEL */}
          <Card className="lg:col-span-2 p-4 rounded-xl shadow-md bg-card flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Chat with {recipientOptions.find(r => r.id === selectedChat)?.label}
              </h2>
              <select
                value={selectedChat}
                onChange={(e) => setSelectedChat(e.target.value)}
                className="border px-3 py-1 rounded-md text-sm"
              >
                {recipientOptions.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto bg-muted/30 border rounded-lg p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-xl shadow-sm
                    ${msg.from === "me"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white border rounded-bl-none"}`}>
                    <p>{msg.text}</p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4 border p-2 rounded-xl bg-background">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4 mr-1" /> Send
              </Button>
            </div>
          </Card>

          {/* RIGHT STAT CARDS */}
          <div className="space-y-4">

            <Card className="p-5 rounded-xl shadow-md border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Active Chats</p>
                  <p className="text-2xl font-bold">4 Chats</p>
                  <p className="text-xs text-muted-foreground mt-1">Manage patient & phlebotomist discussions.</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <MessageCircle className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-5 rounded-xl shadow-md border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Awaiting Replies</p>
                  <p className="text-2xl font-bold">2 Chats</p>
                  <p className="text-xs text-muted-foreground mt-1">Respond promptly to maintain trust.</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-5 rounded-xl shadow-md border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Report Queries</p>
                  <p className="text-2xl font-bold">3 Queries</p>
                  <p className="text-xs text-muted-foreground mt-1">Assist patients with report explanation.</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <FileCheck className="h-6 w-6" />
                </div>
              </div>
            </Card>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default LabMessages;
