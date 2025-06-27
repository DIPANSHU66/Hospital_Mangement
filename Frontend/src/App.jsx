import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Appointment from "./components/Appointment";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminRegister from "./components/AdminRegister";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import axios from "axios";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import DoctorRegister from "./components/DoctorRegister";

const App = () => {
  useEffect(() => {
    const fetchuser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/user/patient/me",
          { withCredentials: true }
        );
        if (response.data.success) {
        }
      } catch (e) {
        toast.error("Failed to fetch user data");
      }
    };
    fetchuser();
  }, []);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Appointment" element={<Appointment />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/admin" element={<AdminRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/register-doctor" element={<DoctorRegister />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
