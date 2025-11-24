// src/components/patient/TestBookingForm.tsx


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestTube, Home, Building2, CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testCategories = [
  { id: 1, name: "Complete Blood Count (CBC)" },
  { id: 2, name: "Blood Sugar" },
  { id: 3, name: "Lipid Panel" },
  { id: 4, name: "Liver Function Test" },
  { id: 5, name: "Kidney Function Test" },
  { id: 6, name: "Thyroid Test" },
  { id: 7, name: "Urine Test" },
  { id: 8, name: "COVID-19 PCR" },
];

const labs = [
  { id: 1, name: "LabOne", address: "123 Main St" },
  { id: 2, name: "LabTwo", address: "456 Park Ave" },
];

const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM"];


const steps = [
  { label: "Select Test(s)", icon: <TestTube className="w-5 h-5" /> },
  { label: "Choose Mode", icon: <Home className="w-5 h-5" /> },
  { label: "Lab & Slot", icon: <Building2 className="w-5 h-5" /> },
  { label: "Address", icon: <CalendarDays className="w-5 h-5" /> },
  { label: "Review", icon: <CheckCircle2 className="w-5 h-5" /> },
];

const TestBookingForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [mode, setMode] = useState<"home" | "lab" | "">("");
  const [selectedLab, setSelectedLab] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const handleTestSelect = (id: number) => {
    setSelectedTests((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2500);
  };

  // Step indicator
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-6">
      {steps.map((s, idx) => {
        const active = step === idx + 1;
        const completed = step > idx + 1;
        return (
          <div key={s.label} className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: active ? 1.1 : 1, opacity: active ? 1 : completed ? 0.7 : 0.5 }}
              className={`rounded-full p-2 ${active ? "bg-primary text-white" : completed ? "bg-green-100 text-green-600" : "bg-muted"}`}
            >
              {s.icon}
            </motion.div>
            <span className={`text-xs mt-1 ${active ? "font-bold text-primary" : completed ? "text-green-600" : "text-muted-foreground"}`}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <Card className="max-w-xl mx-auto mt-8 shadow-lg">
      {renderStepIndicator()}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {!confirmed && step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TestTube className="w-6 h-6 text-primary" /> Select Test(s)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 mb-4">
                  {testCategories.map((test) => (
                    <label key={test.id} className="flex items-center gap-2 cursor-pointer bg-muted/50 rounded px-3 py-2 hover:bg-primary/10 transition">
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test.id)}
                        onChange={() => handleTestSelect(test.id)}
                        className="accent-primary"
                      />
                      <span className="text-base font-medium">{test.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Select one or more tests to proceed.</p>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  type="button"
                  disabled={selectedTests.length === 0}
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {!confirmed && step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Home className="w-6 h-6 text-primary" /> Choose Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-muted/50 rounded px-3 py-2 hover:bg-primary/10 transition">
                    <input
                      type="radio"
                      name="mode"
                      value="home"
                      checked={mode === "home"}
                      onChange={() => setMode("home")}
                      className="accent-primary"
                    />
                    <span className="font-medium">Home Collection</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-muted/50 rounded px-3 py-2 hover:bg-primary/10 transition">
                    <input
                      type="radio"
                      name="mode"
                      value="lab"
                      checked={mode === "lab"}
                      onChange={() => setMode("lab")}
                      className="accent-primary"
                    />
                    <span className="font-medium">Visit Lab</span>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">Choose how you want to give your sample.</p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="secondary" type="button" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" disabled={mode === ""} onClick={() => setStep(3)}>
                  Next
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {!confirmed && step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="w-6 h-6 text-primary" /> Select Laboratory & Slot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Laboratory:</label>
                  <select
                    value={selectedLab ?? ""}
                    onChange={(e) => setSelectedLab(Number(e.target.value))}
                    className="mb-4 p-2 border rounded w-full"
                  >
                    <option value="">Select Lab</option>
                    {labs.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name} ({lab.address})
                      </option>
                    ))}
                  </select>
                  <label className="block mb-2 font-medium">Date:</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mb-4"
                  />
                  <label className="block mb-2 font-medium">Time Slot:</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                  >
                    <option value="">Select Slot</option>
                    {slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">Select your preferred lab, date, and time slot.</p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="secondary" type="button" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={!selectedLab || !selectedDate || !selectedSlot}
                  onClick={() => setStep(mode === "home" ? 4 : 5)}
                >
                  Next
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {!confirmed && step === 4 && mode === "home" && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarDays className="w-6 h-6 text-primary" /> Enter Pickup Address</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address for Home Collection"
                  required
                  className="mb-4"
                />
                <p className="text-xs text-muted-foreground">Provide a valid address for home sample collection.</p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="secondary" type="button" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={address.trim() === ""}
                  onClick={() => setStep(5)}
                >
                  Next
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {!confirmed && step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-primary" /> Review & Confirm Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2">
                  <div><strong>Tests:</strong> {testCategories.filter((t) => selectedTests.includes(t.id)).map((t) => t.name).join(", ")}</div>
                  <div><strong>Mode:</strong> {mode === "home" ? "Home Collection" : "Visit Lab"}</div>
                  <div><strong>Lab:</strong> {labs.find((lab) => lab.id === selectedLab)?.name || ""}</div>
                  <div><strong>Date:</strong> {selectedDate}</div>
                  <div><strong>Slot:</strong> {selectedSlot}</div>
                  {mode === "home" && <div><strong>Address:</strong> {address}</div>}
                  <div><strong>Payment Method:</strong> {paymentMethod ? paymentMethod : <span className="text-red-500">Not selected</span>}</div>
                  <div><strong>Assigned Phlebotomist:</strong> <span className="text-muted-foreground">(To be assigned)</span></div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Select Payment Method:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="Online"
                        checked={paymentMethod === "Online"}
                        onChange={() => setPaymentMethod("Online")}
                        className="accent-primary"
                      />
                      <span>Online</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="Pay at Visit"
                        checked={paymentMethod === "Pay at Visit"}
                        onChange={() => setPaymentMethod("Pay at Visit")}
                        className="accent-primary"
                      />
                      <span>Pay at Visit</span>
                    </label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Please review your booking before confirming.</p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="secondary" type="button" onClick={() => setStep(mode === "home" ? 4 : 3)}>
                  Back
                </Button>
                <Button type="submit" variant="default" disabled={!paymentMethod}>
                  Confirm & Book
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {confirmed && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-6">Your test booking has been submitted successfully.</p>
              <Button variant="secondary" onClick={() => navigate("/patient")}>Return to Dashboard</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Card>
  );
};

export default TestBookingForm;