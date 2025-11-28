import React, { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  MessageCircle,
  Clock,
  TestTube,
  MessageSquare,
  CheckCheck,
} from "lucide-react";

// message type
type Message = {
  from: "me" | "lab" | "phlebotomist" | "support";
  text: string;
  time: string;
  read?: boolean;
};

const recipientOptions = [
  { id: "lab", label: "Lab Support" },
  { id: "phlebotomist", label: "Phlebotomist" },
  { id: "support", label: "Help / Support" },
];

const PatientMessages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState("lab");

  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    lab: [
      { from: "me", text: "Hello, I want to confirm my test.", time: "09:01 AM", read: true },
      { from: "lab", text: "Sure! Which test?", time: "09:03 AM" },
    ],
    phlebotomist: [
      { from: "phlebotomist", text: "I will reach your address at 10 AM.", time: "08:30 AM" },
      { from: "me", text: "Okay, thank you.", time: "08:31 AM", read: true },
    ],
    support: [
      { from: "support", text: "How may we help you today?", time: "08:00 AM" },
    ],
  });

  const messages = chatHistory[selectedChat];
  const [input, setInput] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setChatHistory(prev => ({
      ...prev,
      [selectedChat]: [
        ...prev[selectedChat],
        { from: "me", text: input.trim(), time: "Now" },
      ],
    }));
    setInput("");
  };

  return (
    <DashboardLayout role="patient">
      <div className="flex flex-col gap-6 h-[calc(100vh-80px)]">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Chat with your lab and phlebotomist regarding your bookings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 h-full">

          {/* CHAT PANEL */}
          <Card className="lg:col-span-2 p-4 rounded-xl shadow-md bg-card flex flex-col">
            {/* Top bar */}
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

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto bg-muted/30 rounded-lg border p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs rounded-xl px-4 py-2 shadow-sm
                    ${msg.from === "me"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white border rounded-bl-none"}`}>
                    <p>{msg.text}</p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-3 mt-4 p-2 border bg-background rounded-xl">
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

          {/* RIGHT SIDE DASHBOARD CARDS */}
          <div className="space-y-4">

            {/* CARD 1 */}
            <Card className="p-5 shadow-md rounded-xl border border-border bg-card">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Active Chats</p>
                  <p className="text-2xl font-bold mt-1">2 Chats</p>
                  <p className="text-xs text-muted-foreground mt-1">You’re in touch with Lab & Phlebotomist</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MessageCircle className="h-6 w-6" />
                </div>
              </div>
            </Card>

            {/* CARD 2 */}
            <Card className="p-5 shadow-md rounded-xl border border-border bg-card">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold mt-1">~5 min</p>
                  <p className="text-xs text-muted-foreground mt-1">Labs reply quickly during working hours.</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </Card>

            {/* CARD 3 */}
            <Card className="p-5 shadow-md rounded-xl border border-border bg-card">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Upcoming Tests</p>
                  <p className="text-2xl font-bold mt-1">3 Tests</p>
                  <p className="text-xs text-muted-foreground mt-1">Use chat to confirm fasting & timing.</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <TestTube className="h-6 w-6" />
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientMessages;
