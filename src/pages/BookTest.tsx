// src/pages/BookTest.tsx
import React from "react";
import TestBookingForm from "../components/patient/TestBookingForm";

const BookTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-12 px-2">
      <div className="max-w-xl w-full mx-auto">
        <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100">
          <h1 className="text-3xl font-extrabold mb-8 text-blue-700 text-center drop-shadow">Book Diagnostic Test</h1>
          <TestBookingForm />
        </div>
      </div>
    </div>
  );
};

export default BookTest;