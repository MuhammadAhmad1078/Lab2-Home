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
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AddressAutocomplete from "@/components/shared/AddressAutocomplete";

/* ----------------------------------------------
   TYPES
---------------------------------------------- */
// Import types from BookTest or define shared types
interface Test {
  _id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  preparationInstructions?: string;
  reportDeliveryTime: string;
  sampleType?: string;
}

interface LabInfo {
  _id: string;
  labName: string;
  labAddress: string;
  rating?: number;
  distance?: string;
  logo?: string;
  availableTests: Test[];
  operatingHours?: {
    open: string;
    close: string;
  };
}

interface FormProps {
  selectedLab: LabInfo | null;
}

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
  const { user } = useAuth();
  const navigate = useNavigate();

  /* Form States */
  const [step, setStep] = useState(1);
  const [selectedTests, setSelectedTests] = useState<string[]>([]); // Array of Test IDs
  const [mode, setMode] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
     HANDLE SUBMISSION
  ---------------------------------------------- */
  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to book a test");
      navigate("/login");
      return;
    }

    if (!selectedLab) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('lab2home_token');

      // Create a booking for each selected test
      const promises = selectedTests.map(testId => {
        return fetch('http://localhost:5000/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            patient: user.id,
            lab: selectedLab._id,
            test: testId,
            bookingDate: selectedDate,
            preferredTimeSlot: selectedSlot,
            collectionType: mode,
            collectionAddress: mode === 'home' ? address : undefined,
            status: 'pending',
            paymentStatus: 'pending',
          }),
        });
      });

      await Promise.all(promises);

      setConfirmed(true);
      toast.success("Booking confirmed successfully!");
      setTimeout(() => {
        resetForm();
        navigate("/patient"); // Redirect to dashboard
      }, 2000);

    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ----------------------------------------------
     UI
  ---------------------------------------------- */
  if (!selectedLab) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No Lab Selected</h3>
        <p className="text-muted-foreground">Please select a laboratory from the list to proceed with booking.</p>
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto shadow-lg">

      {/* Step Indicator */}
      <div className="flex justify-center gap-4 my-4">
        {steps.map((s, idx) => {
          const active = step === idx + 1;
          return (
            <div key={s.label} className="flex flex-col items-center">
              <div
                className={`rounded-full p-2 transition-all ${active ? "bg-primary text-white" : "bg-muted"
                  }`}
              >
                {s.icon}
              </div>
              <span
                className={`text-[11px] mt-1 ${active ? "text-primary font-semibold" : "text-muted-foreground"
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

            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {selectedLab.availableTests.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No tests available for this lab.</p>
              ) : (
                selectedLab.availableTests.map((test) => (
                  <label
                    key={test._id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedTests.includes(test._id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test._id)}
                      onChange={() =>
                        setSelectedTests((prev) =>
                          prev.includes(test._id)
                            ? prev.filter((x) => x !== test._id)
                            : [...prev, test._id]
                        )
                      }
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{test.name}</span>
                        <span className="text-primary font-semibold">₹{test.basePrice}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{test.description}</p>
                      <div className="flex gap-2 mt-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                        <span className="bg-muted px-1.5 py-0.5 rounded">{test.category}</span>
                        <span className="bg-muted px-1.5 py-0.5 rounded">{test.reportDeliveryTime}</span>
                      </div>
                    </div>
                  </label>
                ))
              )}
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
              <label className={`cursor-pointer flex-1 flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${mode === 'home' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                <input
                  type="radio"
                  name="mode"
                  className="hidden"
                  onChange={() => setMode("home")}
                  checked={mode === "home"}
                />
                <Home className={`h-8 w-8 ${mode === 'home' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-medium">Home Collection</span>
                <span className="text-xs text-muted-foreground text-center">Phlebotomist visits your home</span>
              </label>

              <label className={`cursor-pointer flex-1 flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${mode === 'lab' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                <input
                  type="radio"
                  name="mode"
                  className="hidden"
                  onChange={() => setMode("lab")}
                  checked={mode === "lab"}
                />
                <Building2 className={`h-8 w-8 ${mode === 'lab' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-medium">Visit Lab</span>
                <span className="text-xs text-muted-foreground text-center">You visit the lab center</span>
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
              <CardTitle>Date & Time</CardTitle>
            </CardHeader>

            <CardContent>
              {/* Selected Lab */}
              <div className="flex gap-3 p-3 border rounded bg-primary/10 mb-4">
                <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedLab.labName}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedLab.labAddress}
                  </p>
                </div>
              </div>

              {/* Date */}
              <label className="text-xs font-medium block mb-1.5">Select Date</label>
              <Input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mb-4"
              />

              {/* Slots */}
              <label className="text-xs font-medium block mb-1.5">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 text-sm rounded border transition-all ${selectedSlot === slot
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:border-primary/50'
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
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
              <AddressAutocomplete
                onSelect={(addr) => setAddress(addr)}
                defaultValue={address}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Search for your address or use current location.
              </p>
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

            <CardContent className="space-y-4 text-sm">
              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Laboratory:</span>
                  <span className="font-medium">{selectedLab.labName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">{selectedDate} at {selectedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Collection Type:</span>
                  <span className="font-medium capitalize">{mode === 'home' ? 'Home Collection' : 'Lab Visit'}</span>
                </div>
                {mode === "home" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium text-right max-w-[200px]">{address}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Selected Tests</h4>
                <div className="space-y-2">
                  {selectedTests.map((id) => {
                    const test = selectedLab.availableTests.find((t) => t._id === id);
                    return (
                      <div key={id} className="flex justify-between text-sm border-b pb-2">
                        <span>{test?.name}</span>
                        <span className="font-medium">₹{test?.basePrice}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between pt-2 font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₹{selectedTests.reduce((sum, id) => {
                    const test = selectedLab.availableTests.find((t) => t._id === id);
                    return sum + (test?.basePrice || 0);
                  }, 0)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep(mode === "home" ? 4 : 3)}
                disabled={submitting}
              >
                Back
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Confirm & Book"
                )}
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
