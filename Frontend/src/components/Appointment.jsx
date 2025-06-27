import React from "react";
import AppointmentForm from "./AppointmentForm";
import Hero from "./Hero";

const Appointment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <Hero
        title="Book Your Appointment Today!"
        subtitle="Quick, easy, and secure scheduling with Dipanshu Medical Institute"
        imageUrl="https://static.vecteezy.com/system/resources/previews/041/437/133/non_2x/strategic-planning-in-business-3d-character-illustration-png.png"
      />

      <div className="py-10 px-4 max-w-7xl mx-auto">
        <AppointmentForm />
      </div>
    </div>
  );
};

export default Appointment;
