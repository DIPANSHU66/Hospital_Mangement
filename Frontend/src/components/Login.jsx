import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    role: "Patient",
  });

  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        {
          email: form.email,
          password: form.password,
          confirmpassword: form.confirmpassword,
          role: form.role,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
        setForm({
          email: "",
          password: "",
          confirmPassword: "",
          role: "Patient",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-blue-600">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to{" "}
            <span className="font-semibold text-blue-800">
              Dipanshu Medical Institute ❤️
            </span>
          </p>
        </div>

        <form onSubmit={handlelogin} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@mail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirmpassword}
                onChange={(e) =>
                  setForm({ ...form, confirmpassword: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Re-enter your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300"
            >
              Login →
            </button>
          </div>
        </form>

        <div className="text-center pt-6">
          <p className="text-base text-gray-700 font-medium mb-2">
            Not Registered? Choose your role to register:
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="text-green-600 hover:underline">
              ➤ Patient Register
            </Link>
          
            <Link to="/register/admin" className="text-red-600 hover:underline">
              ➤ Admin Register
            </Link>
          </div>
        </div>

        <div className="pt-8 text-center text-gray-400 text-sm border-t border-gray-200">
          ⓒ {new Date().getFullYear()} Dipanshu Medical Institute. All rights
          reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
