// src/components/patient/TestBookingForm.tsx

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  TestTube,
  Home,
  Building2,
  CalendarDays,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------------- TEST CATALOG ---------------------- */

const testCategories = [
  { id: 1, name: "Complete Blood Count (CBC)" },
  { id: 2, name: "Blood Sugar (Fasting)" },
  { id: 3, name: "Lipid Profile" },
  { id: 4, name: "Liver Function Test (LFT)" },
  { id: 5, name: "Kidney Function Test (KFT)" },
  { id: 6, name: "Thyroid Profile (TSH, T3, T4)" },
  { id: 7, name: "Urine Routine Examination" },
  { id: 8, name: "COVID-19 PCR" },
];

/* ---------------------- LAB & SLOTS (Static) ---------------------- */

const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM"];

/* ---------------------- PAKISTAN ADDRESS DATA ---------------------- */

const pakistanAddress: {
  [province: string]: {
    [city: string]: string[];
  };
} = {
  Punjab: {
    Lahore: ["Johar Town", "Model Town", "Gulberg", "DHA", "Iqbal Town"],
    Faisalabad: ["D Ground", "Samundari Road", "Jinnah Colony", "Madina Town"],
    Rawalpindi: ["Saddar", "Peshawar Road", "Satellite Town", "Chandni Chowk"],
    Multan: ["Cantt", "Shah Rukn-e-Alam", "Gulgasht", "Boson Road"],
  },
  Sindh: {
    Karachi: ["Gulshan-e-Iqbal", "Nazimabad", "DHA", "Clifton", "North Karachi"],
    Hyderabad: ["Latifabad", "Qasimabad", "City Area"],
    Sukkur: ["Barrange Road", "Minara Road"],
  },
  "Khyber Pakhtunkhwa": {
    Peshawar: ["University Road", "Hayatabad", "Saddar"],
    Mardan: ["Cantt", "Bank Road"],
  },
  Balochistan: {
    Quetta: ["Jinnah Road", "Sariab Road", "Cantt"],
  },
  Islamabad: {
    Islamabad: ["F-6", "F-7", "G-10", "G-11", "Blue Area"],
    Rawalpindi: ["Saddar", "Murree Road", "Commercial Market"],
  },
};

/* ---------------------- STEPS ---------------------- */

const steps = [
  { label: "Select Test(s)", icon: <TestTube className="w-5 h-5" /> },
  { label: "Choose Mode", icon: <Home className="w-5 h-5" /> },
  { label: "Date & Slot", icon: <CalendarDays className="w-5 h-5" /> },
  { label: "Address", icon: <Home className="w-5 h-5" /> },
  { label: "Review", icon: <CheckCircle2 className="w-5 h-5" /> },
];

const TestBookingForm: React.FC = () => {
  const navigate = useNavigate();

  // Step state
  const [step, setStep] = useState<number>(1);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  // Test selection
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [testSearch, setTestSearch] = useState<string>("");

  // Mode: home / lab
  const [mode, setMode] = useState<"home" | "lab" | "">("");

  // Date & slot
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  // Address (for home collection)
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [street, setStreet] = useState<string>("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // Date constraint: cannot choose past dates
  const todayISO = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  /* ---------------------- Handlers ---------------------- */

  const handleTestSelect = (id: number) => {
    setSelectedTests((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);

    // In a real app, you'd send the payload to backend here

    // Optionally reset after some time
    setTimeout(() => {
      setConfirmed(false);
      setStep(1);
      setSelectedTests([]);
      setMode("");
      setSelectedDate("");
      setSelectedSlot("");
      setProvince("");
      setCity("");
      setArea("");
      setStreet("");
      setPaymentMethod("");
    }, 2500);
  };

  // Step indicator UI
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-6">
      {steps.map((s, idx) => {
        const active = step === idx + 1;
        const completed = step > idx + 1;

        return (
          <div key={s.label} className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: active ? 1.1 : 1,
                opacity: active ? 1 : completed ? 0.7 : 0.5,
              }}
              className={`rounded-full p-2 ${
                active
                  ? "bg-primary text-white"
                  : completed
                  ? "bg-green-100 text-green-600"
                  : "bg-muted"
              }`}
            >
              {s.icon}
            </motion.div>
            <span
              className={`text-xs mt-1 ${
                active
                  ? "font-bold text-primary"
                  : completed
                  ? "text-green-600"
                  : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  /* ---------------------- Derived Lists ---------------------- */

  const filteredTests = useMemo(() => {
    const term = testSearch.toLowerCase().trim();
    if (!term) return testCategories;
    return testCategories.filter((t) =>
      t.name.toLowerCase().includes(term)
    );
  }, [testSearch]);

  const availableCities = province
    ? Object.keys(pakistanAddress[province] || {})
    : [];

  const availableAreas =
    province && city ? pakistanAddress[province]?.[city] || [] : [];

  const fullAddress =
    mode === "home" && province && city && area && street
      ? `${street}, ${area}, ${city}, ${province}, Pakistan`
      : "";

  /* ---------------------- JSX ---------------------- */

  return (
    <Card className="max-w-xl mx-auto mt-8 shadow-lg">
      {renderStepIndicator()}

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* STEP 1: Select Tests + Search */}
          {!confirmed && step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-6 h-6 text-primary" />
                  Select Test(s)
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* Search bar for tests */}
                <div className="mb-3">
                  <Input
                    placeholder="Search tests (e.g. CBC, Lipid, Thyroid)..."
                    value={testSearch}
                    onChange={(e) => setTestSearch(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="grid gap-3 mb-4 max-h-64 overflow-y-auto">
                  {filteredTests.map((test) => (
                    <label
                      key={test.id}
                      className="flex items-center gap-2 cursor-pointer bg-muted/50 rounded px-3 py-2 hover:bg-primary/10 transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test.id)}
                        onChange={() => handleTestSelect(test.id)}
                        className="accent-primary"
                      />
                      <span className="text-base font-medium">
                        {test.name}
                      </span>
                    </label>
                  ))}

                  {filteredTests.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No tests found for this search.
                    </p>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Select one or more tests to proceed.
                </p>
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

          {/* STEP 2: Choose Mode */}
          {!confirmed && step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-6 h-6 text-primary" />
                  Choose Mode
                </CardTitle>
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

                <p className="text-xs text-muted-foreground">
                  Choose how you want to give your sample.
                </p>
              </CardContent>

              <CardFooter className="justify-between">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={mode === ""}
                  onClick={() => setStep(3)}
                >
                  Next
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {/* STEP 3: Date & Slot */}
          {!confirmed && step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-primary" />
                  Select Date & Time Slot
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">
                    Date:
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    min={todayISO}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mb-4"
                  />

                  <label className="block mb-2 font-medium text-sm">
                    Time Slot:
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="mb-4 p-2 border rounded w-full text-sm"
                  >
                    <option value="">Select Slot</option>
                    {slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-muted-foreground">
                  Choose a suitable date and time for your test.
                </p>
              </CardContent>

              <CardFooter className="justify-between">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={!selectedDate || !selectedSlot}
                  onClick={() =>
                    setStep(mode === "home" ? 4 : 5)
                  }
                >
                  Next
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {/* STEP 4: Address (only for home collection) */}
          {!confirmed && step === 4 && mode === "home" && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-primary" />
                  Enter Pickup Address (Pakistan)
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      setCity("");
                      setArea("");
                    }}
                    className="w-full p-2 border rounded text-sm"
                  >
                    <option value="">Select Province</option>
                    {Object.keys(pakistanAddress).map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setArea("");
                    }}
                    className="w-full p-2 border rounded text-sm"
                    disabled={!province}
                  >
                    <option value="">Select City</option>
                    {availableCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Area / Locality
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    disabled={!city}
                  >
                    <option value="">Select Area</option>
                    {availableAreas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Street / House #
                  </label>
                  <Input
                    placeholder="House #, Street #, Block..."
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <p className="text-[11px] text-muted-foreground">
                  This address will be used by the phlebotomist to reach you for
                  home sample collection.
                </p>
              </CardContent>

              <CardFooter className="justify-between">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setStep(3)}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={
                    !province || !city || !area || street.trim() === ""
                  }
                  onClick={() => setStep(5)}
                >
                  Next
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {/* STEP 5: Review & Confirm */}
          {!confirmed && step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Review & Confirm Booking
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="mb-4 space-y-2 text-sm">
                  <div>
                    <strong>Tests:</strong>{" "}
                    {testCategories
                      .filter((t) => selectedTests.includes(t.id))
                      .map((t) => t.name)
                      .join(", ")}
                  </div>
                  <div>
                    <strong>Mode:</strong>{" "}
                    {mode === "home" ? "Home Collection" : "Visit Lab"}
                  </div>
                  <div>
                    <strong>Date:</strong> {selectedDate || "-"}
                  </div>
                  <div>
                    <strong>Time:</strong> {selectedSlot || "-"}
                  </div>
                  {mode === "home" && (
                    <div>
                      <strong>Address:</strong>{" "}
                      {fullAddress || (
                        <span className="text-red-500">
                          Not fully specified
                        </span>
                      )}
                    </div>
                  )}
                  <div>
                    <strong>Payment Method:</strong>{" "}
                    {paymentMethod ? (
                      paymentMethod
                    ) : (
                      <span className="text-red-500">
                        Not selected
                      </span>
                    )}
                  </div>
                  <div>
                    <strong>Assigned Phlebotomist:</strong>{" "}
                    <span className="text-muted-foreground">
                      (To be assigned)
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">
                    Select Payment Method:
                  </label>
                  <div className="flex gap-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="Online"
                        checked={paymentMethod === "Online"}
                        onChange={() =>
                          setPaymentMethod("Online")
                        }
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
                        onChange={() =>
                          setPaymentMethod("Pay at Visit")
                        }
                        className="accent-primary"
                      />
                      <span>Pay at Visit</span>
                    </label>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Please review your booking before confirming.
                </p>
              </CardContent>

              <CardFooter className="justify-between">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    setStep(mode === "home" ? 4 : 3)
                  }
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={!paymentMethod}
                >
                  Confirm & Book
                </Button>
              </CardFooter>
            </motion.div>
          )}

          {/* CONFIRMED STATE */}
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
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-muted-foreground mb-6 text-sm text-center">
                Your test booking has been submitted successfully.
              </p>
              <Button
                variant="secondary"
                onClick={() => navigate("/patient")}
              >
                Return to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Card>
  );
};

export default TestBookingForm;
