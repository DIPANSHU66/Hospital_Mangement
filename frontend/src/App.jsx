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
import Chatbot from "./components/Chatbot";
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

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/display/doctors" element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
        
        {/* Patient Only Routes */}
        <Route path="/Appointment" element={<ProtectedRoute allowedRoles={["Patient"]}><Appointment /></ProtectedRoute>} />
        <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={["Patient"]}><PatientProfile /></ProtectedRoute>} />
        
        {/* Doctor Only Routes */}
        <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={["Doctor"]}><DoctorProfile /></ProtectedRoute>} />
        
        {/* Admin Only Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/register-doctor" element={<ProtectedRoute allowedRoles={["Admin"]}><DoctorRegister /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute allowedRoles={["Admin"]}><Messages /></ProtectedRoute>} />
        <Route path="/message/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><MessageDetail /></ProtectedRoute>} />
      </Routes>
      <Chatbot />
      <Footer />
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;