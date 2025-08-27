import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    password: "",
    gender: "",
    role: "Patient",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://hospital-mangement-9amd.onrender.com/api/v1/user/register",
        form,
        {
          headers: { "Content-Type": "application/json" }, // ✅ removed withCredentials
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login"); // redirect to login page
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }

    // Reset form
    setForm({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      nic: "",
      dob: "",
      password: "",
      gender: "",
      role: "Patient",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white border border-gray-300 rounded-3xl shadow-2xl p-10 md:p-16">
        <div className="text-center mb-12">
          <img
            src="https://th.bing.com/th/id/OIP.J2Ii3CuiN8Hg43HWTSYDRAHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
            alt="patient"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h1 className="text-5xl font-bold text-green-700 mb-2">
            Welcome! 👩‍⚕️👨‍⚕️
          </h1>
          <p className="text-xl text-gray-600">
            Join{" "}
            <span className="font-semibold text-red-500">
              Dipanshu Medical Institute ❤️
            </span>
          </p>
        </div>

        <h2 className="text-4xl font-semibold text-center text-blue-600 mb-4">
          Create Your Account
        </h2>
        <p className="text-center text-lg text-gray-500 mb-10">
          Fill in the details below to register
        </p>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={form.firstname}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              name="nic"
              placeholder="NIC"
              value={form.nic}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl bg-white text-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-semibold py-4 rounded-xl shadow-lg"
          >
            Register Now
          </button>
        </form>

        <div className="pt-12 text-center text-gray-400 text-sm border-t border-gray-300 mt-10">
          ⓒ {new Date().getFullYear()} Dipanshu Medical Institute. All rights
          reserved.
        </div>
      </div>
    </div>
  );
};

export default Register;
