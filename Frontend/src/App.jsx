import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Appointment from "./components/Appointment";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminRegister from "./components/AdminRegister";
import AdminDashboard from "./components/AdminDashboard";
import DoctorRegister from "./components/DoctorRegister";
import DoctorProfile from "./components/DoctorProfile";
import PatientProfile from "./components/PatientProfile";
import Messages from "./components/Messages";
import MessageDetail from "./components/MessageDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorsList from "./components/DoctorsList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/admin" element={<AdminRegister />} />


          <Route path="/" element={ <ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/Appointment" element={  <ProtectedRoute><Appointment /></ProtectedRoute>} />
          <Route path="/about" element={  <ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={  <ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/register-doctor" element={  <ProtectedRoute><DoctorRegister /></ProtectedRoute>} />
          <Route path="/doctor/profile" element={ <ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
          <Route path="/patient/profile" element={  <ProtectedRoute><PatientProfile /></ProtectedRoute>} />
          <Route path="/admin/messages" element={ <ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/message/:id" element={  <ProtectedRoute><MessageDetail /></ProtectedRoute>} />
          <Route path="/display/doctors" element={  <ProtectedRoute><DoctorsList /></ProtectedRoute>} />
       
      </Routes>
      <Footer />
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
