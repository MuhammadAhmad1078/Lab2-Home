// src/components/patient/TestBookingForm.tsx

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TestTube,
  Home,
  Building2,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ----------------------------------------------
   TYPES
---------------------------------------------- */
interface LabInfo {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  logo: string;
  tests: number[];
  slots: string[];
}

interface FormProps {
  selectedLab: LabInfo | null;
}

/* ----------------------------------------------
   TEST DEFINITIONS
---------------------------------------------- */
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

/* ----------------------------------------------
   STEPS
---------------------------------------------- */
const steps = [
  { label: "Select Test(s)", icon: <TestTube className="w-5 h-5" /> },
  { label: "Choose Mode", icon: <Home className="w-5 h-5" /> },
  { label: "Lab & Slot", icon: <Building2 className="w-5 h-5" /> },
  { label: "Address", icon: <CalendarDays className="w-5 h-5" /> },
  { label: "Review", icon: <CheckCircle2 className="w-5 h-5" /> },
];

/* ----------------------------------------------
   COMPONENT
---------------------------------------------- */
const TestBookingForm: React.FC<FormProps> = ({ selectedLab }) => {
  /* Form States */
  const [step, setStep] = useState(1);
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [mode, setMode] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  /* Today (for date validation) */
  const today = new Date().toISOString().split("T")[0];

  /* ----------------------------------------------
     RESET FORM AFTER SUBMISSION
  ---------------------------------------------- */
  const resetForm = () => {
    setStep(1);
    setSelectedTests([]);
    setMode("");
    setSelectedSlot("");
    setSelectedDate("");
    setAddress("");
    setConfirmed(false);
  };

  /* ----------------------------------------------
     UI
  ---------------------------------------------- */
  return (
    <Card className="max-w-xl mx-auto shadow-lg">

      {/* Step Indicator */}
      <div className="flex justify-center gap-4 my-4">
        {steps.map((s, idx) => {
          const active = step === idx + 1;
          return (
            <div key={s.label} className="flex flex-col items-center">
              <div
                className={`rounded-full p-2 transition-all ${
                  active ? "bg-primary text-white" : "bg-muted"
                }`}
              >
                {s.icon}
              </div>
              <span
                className={`text-[11px] mt-1 ${
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* -------------------------------------------------
            STEP 1 — SELECT TESTS
        --------------------------------------------------- */}
        {step === 1 && !confirmed && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CardHeader>
              <CardTitle>Select Test(s)</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {selectedLab?.tests.map((id) => {
                const test = testCategories.find((t) => t.id === id);
                return (
                  <label
                    key={id}
                    className="flex gap-2 p-2 bg-muted/40 rounded cursor-pointer hover:bg-primary/10"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(id)}
                      onChange={() =>
                        setSelectedTests((prev) =>
                          prev.includes(id)
                            ? prev.filter((x) => x !== id)
                            : [...prev, id]
                        )
                      }
                      className="accent-primary"
                    />
                    {test?.name}
                  </label>
                );
              })}
            </CardContent>

            <CardFooter className="justify-end">
              <Button
                disabled={selectedTests.length === 0}
                onClick={() => setStep(2)}
              >
                Next
              </Button>
            </CardFooter>
          </motion.div>
        )}

        {/* -------------------------------------------------
            STEP 2 — MODE
        --------------------------------------------------- */}
        {step === 2 && !confirmed && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CardHeader>
              <CardTitle>Choose Mode</CardTitle>
            </CardHeader>

            <CardContent className="flex gap-4">
              <label className="cursor-pointer flex gap-2 p-3 bg-muted/40 rounded">
                <input
                  type="radio"
                  name="mode"
                  onChange={() => setMode("home")}
                />
                Home Collection
              </label>

              <label className="cursor-pointer flex gap-2 p-3 bg-muted/40 rounded">
                <input
                  type="radio"
                  name="mode"
                  onChange={() => setMode("lab")}
                />
                Visit Lab
              </label>
            </CardContent>

            <CardFooter className="justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!mode} onClick={() => setStep(3)}>
                Next
              </Button>
            </CardFooter>
          </motion.div>
        )}

        {/* -------------------------------------------------
            STEP 3 — LAB & SLOT
        --------------------------------------------------- */}
        {step === 3 && !confirmed && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CardHeader>
              <CardTitle>Laboratory & Slot</CardTitle>
            </CardHeader>

            <CardContent>
              {/* Selected Lab */}
              <div className="flex gap-3 p-3 border rounded bg-primary/10 mb-4">
                <img
                  src={selectedLab?.logo}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{selectedLab?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedLab?.address}
                  </p>
                </div>
              </div>

              {/* Date */}
              <label className="text-xs font-medium">Date:</label>
              <Input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mb-4"
              />

              {/* Slots */}
              <label className="text-xs font-medium">Time Slot:</label>
              <select
                className="border p-2 rounded w-full"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="">Select Slot</option>
                {selectedLab?.slots.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </CardContent>

            <CardFooter className="justify-between">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                disabled={!selectedSlot || !selectedDate}
                onClick={() => setStep(mode === "home" ? 4 : 5)}
              >
                Next
              </Button>
            </CardFooter>
          </motion.div>
        )}

        {/* -------------------------------------------------
            STEP 4 — ADDRESS (only for home)
        --------------------------------------------------- */}
        {step === 4 && mode === "home" && !confirmed && (
          <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CardHeader>
              <CardTitle>Pickup Address</CardTitle>
            </CardHeader>

            <CardContent>
              <Input
                placeholder="Enter your complete address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </CardContent>

            <CardFooter className="justify-between">
              <Button variant="secondary" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button disabled={!address} onClick={() => setStep(5)}>
                Next
              </Button>
            </CardFooter>
          </motion.div>
        )}

        {/* -------------------------------------------------
            STEP 5 — REVIEW & CONFIRM
        --------------------------------------------------- */}
        {step === 5 && !confirmed && (
          <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CardHeader>
              <CardTitle>Review & Confirm</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <p><strong>Lab:</strong> {selectedLab?.name}</p>
              <p>
                <strong>Tests:</strong>{" "}
                {selectedTests
                  .map((id) => testCategories.find((t) => t.id === id)?.name)
                  .join(", ")}
              </p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Slot:</strong> {selectedSlot}</p>
              {mode === "home" && <p><strong>Address:</strong> {address}</p>}
            </CardContent>

            <CardFooter className="justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep(mode === "home" ? 4 : 3)}
              >
                Back
              </Button>

              <Button
                onClick={() => {
                  setConfirmed(true);
                  setTimeout(() => resetForm(), 2000);
                }}
              >
                Confirm & Book
              </Button>
            </CardFooter>
          </motion.div>
        )}

        {/* -------------------------------------------------
            SUCCESS SCREEN
        --------------------------------------------------- */}
        {confirmed && (
          <motion.div
            key="confirmed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 text-center"
          >
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-2" />
            <h2 className="text-xl font-bold">Booking Confirmed!</h2>
            <p className="text-muted-foreground mt-2">
              Your booking has been successfully recorded.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default TestBookingForm;
