import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { SetUser } from "../redux/authSlice";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = user && user.firstname;

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.get("/api/v1/user/logout", { withCredentials: true });
      toast.success("Logged out successfully");
      dispatch(SetUser(null));
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const renderProfileLink = () => {
    if (user?.role === "Doctor") {
      return (
        <Link
          to="/doctor/profile"
          className="hover:text-indigo-600 transition flex items-center gap-1"
        >
          <FaUserCircle /> Dr. {user.firstname}
        </Link>
      );
    }
    if (user?.role === "Admin") {
      return (
        <>
          <Link
            to="/admin/dashboard"
            className="hover:text-indigo-600 transition"
          >
            Admin Dashboard
          </Link>
        </>
      );
    }
    if (user?.role === "Patient") {
      return (
        <>
          <Link
            to="/patient/profile"
            className="hover:text-indigo-600 transition flex items-center gap-1"
          >
            <FaUserCircle /> {user.firstname}
          </Link>
          <Link to="/display/doctors" className="hover:text-indigo-600 transition">
            DoctorsList
          </Link>
          <Link to="/Appointment" className="hover:text-indigo-600 transition">
            Appointments
          </Link>
        </>
      );
    }
    return null;
  };

  const renderLinks = () => (
    <>
      <Link to="/" className="hover:text-indigo-600 transition">
        Home
      </Link>
      <Link to="/about" className="hover:text-indigo-600 transition">
        About
      </Link>

      <Link to="/admin/messages" className="hover:text-indigo-600 transition">
        Messages
      </Link>
      {isAuthenticated && renderProfileLink()}
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
          className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition"
        >
          <FiLogOut /> Logout
        </button>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        Dipanshu Medical
      </Link>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setShow(!show)}
        >
          <GiHamburgerMenu />
        </button>

        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          {renderLinks()}
        </div>
      </div>

      {show && (
        <div className="md:hidden px-4 pb-4 bg-white border-t space-y-3 font-medium text-gray-700">
          {renderLinks()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
