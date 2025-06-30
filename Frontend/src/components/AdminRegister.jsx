import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SetUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";
const AdminRegister = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://hospital-mangement-9amd.onrender.com/api/v1/user/admin/addnew",
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
        dispatch(SetUser(res.data.user));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }

    setForm({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      nic: "",
      dob: "",
      gender: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white border border-gray-300 shadow-2xl rounded-3xl p-10 md:p-14">
        <div className="text-center mb-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="admin"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-5xl font-extrabold text-red-600 mb-2">
            Admin Panel Access
          </h1>
          <p className="text-lg text-gray-600">
            Register as an{" "}
            <span className="font-bold text-blue-700">Authorized Admin</span>
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={form.firstname}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="px-6 py-4 text-lg border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="w-full bg-red-600 hover:bg-red-700 text-white text-xl font-semibold py-4 rounded-xl transition duration-300 shadow-lg"
          >
            Register as Admin
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

export default AdminRegister;
