import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "Patient",
  });

  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
        setForm({
          email: "",
          password: "",
          role: "Patient",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-28 pb-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-200">
        <h1 className="text-center text-5xl font-extrabold text-blue-600 mb-3">
          SIGN IN
        </h1>
        <p className="text-center text-base text-gray-600 mb-2">
          Please login to continue
        </p>
        <h2 className="text-center text-lg font-semibold text-blue-500 mb-8">
          Welcome to <span className="text-blue-700">Dipanshu Medical Institute ❤️</span>
        </h2>

        <form onSubmit={handlelogin} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                placeholder="Enter your email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                placeholder="Enter your password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Select Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            {/* Login as a Link instead of Button */}
            <button
              type="submit"
              className="text-blue-600 font-semibold underline text-lg hover:text-blue-800"
            >
              Login →
            </button>
          </div>

          <div className="text-center pt-10">
            <p className="text-base text-gray-700 font-medium mb-4">
              Not Registered? Choose your role to register:
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-base font-medium">
              <Link to="/register/patient" className="text-blue-600 hover:underline">
                ➤ Patient Register
              </Link>
              <Link to="/register/doctor" className="text-green-600 hover:underline">
                ➤ Doctor Register
              </Link>
              <Link to="/register/admin" className="text-red-600 hover:underline">
                ➤ Admin Register
              </Link>
            </div>
          </div>

          <div className="pt-10 text-center text-gray-400 text-sm border-t border-gray-200 mt-6">
            ⓒ Dipanshu Medical Institute. All rights reserved.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
