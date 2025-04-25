import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Appointment from "./components/Appointment";
import About from "./components/About";
import Login from "./components/Login";
import PatientRegister from "./components/PatientRegister";
import DoctorRegister from "./components/DoctorRegister";
import AdminRegister from "./components/AdminRegister";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import axios from "axios";
import Footer from "./components/Footer";

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
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<About />} />
          <Route path="/register/patient" element={<PatientRegister />} />
          <Route path="/register/doctor" element={<DoctorRegister />} />
          <Route path="/register/admin" element={<AdminRegister />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
