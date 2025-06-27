import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const isAuthenticated = false; // Replace with actual logic

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.get("/api/v1/user/logout");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div>
        <Link to="/" className="text-2xl  font-bold text-indigo-600">
          Dipanshu Medical
        </Link>
      </div>
      <div
        className="ma
      x-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4"
      >
        {/* Hamburger */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setShow(!show)}
        >
          <GiHamburgerMenu />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-indigo-600 transition">
            About
          </Link>
          <Link to="/Appointment" className="hover:text-indigo-600 transition">
            Appointment
          </Link>
          <Link
            to="/admin/dashboard"
            className="hover:text-indigo-600 transition"
          >
            Admin Dashboard
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-indigo-600 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-indigo-600 transition">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-red-500 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {show && (
        <div className="md:hidden px-4 pb-4 bg-white border-t space-y-3 font-medium text-gray-700">
          <Link
            to="/"
            className="block hover:text-indigo-600"
            onClick={() => setShow(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block hover:text-indigo-600"
            onClick={() => setShow(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block hover:text-indigo-600"
            onClick={() => setShow(false)}
          >
            Contact
          </Link>
          <Link
            to="/admin/dashboard"
            className="block hover:text-indigo-600"
            onClick={() => setShow(false)}
          >
            Admin Dashboard
          </Link>
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="block hover:text-indigo-600"
                onClick={() => setShow(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block hover:text-indigo-600"
                onClick={() => setShow(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={(e) => {
                setShow(false);
                handleLogout(e);
              }}
              className="block text-left w-full hover:text-red-500"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
