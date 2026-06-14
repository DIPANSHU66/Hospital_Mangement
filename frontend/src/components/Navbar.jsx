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
      await axios.get(`${import.meta.env.VITE_API_URL}/user/logout`, { withCredentials: true });
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
          className="hover:text-indigo-600 transition flex items-center gap-1.5 text-base"
        >
          <FaUserCircle className="text-lg text-indigo-500" /> Dr. {user.firstname}
        </Link>
      );
    }
    if (user?.role === "Admin") {
      return (
        <>
          <Link
            to="/admin/dashboard"
            className="hover:text-indigo-600 transition text-base"
          >
            Admin Dashboard
          </Link>
          <Link
            to="/admin/messages"
            className="hover:text-indigo-600 transition text-base"
          >
            Inquiries
          </Link>
        </>
      );
    }
    if (user?.role === "Patient") {
      return (
        <>
          <Link to="/display/doctors" className="hover:text-indigo-600 transition text-base">
            Doctors
          </Link>
          <Link to="/Appointment" className="hover:text-indigo-600 transition text-base">
            Book Appointment
          </Link>
          <Link
            to="/patient/profile"
            className="hover:text-indigo-600 transition flex items-center gap-1.5 text-base"
          >
            <FaUserCircle className="text-lg text-indigo-500" /> {user.firstname}
          </Link>
        </>
      );
    }
    return null;
  };

  const renderLinks = () => (
    <>
      <Link to="/" className="hover:text-indigo-600 transition text-base">
        Home
      </Link>
      <Link to="/about" className="hover:text-indigo-600 transition text-base">
        About
      </Link>
      {isAuthenticated && renderProfileLink()}
      {!isAuthenticated ? (
        <>
          <Link to="/login" className="hover:text-indigo-600 transition text-base">
            Login
          </Link>
          <Link to="/register" className="hover:text-indigo-600 transition text-base">
            Register
          </Link>
        </>
      ) : (
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition text-sm font-semibold cursor-pointer border border-red-200/50"
        >
          <FiLogOut /> Logout
        </button>
      )}
    </>
  );

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-150 shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">
        <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 tracking-tight flex items-center gap-2">
          Dipanshu Medical
        </Link>
        
        <button
          className="md:hidden text-gray-700 text-2xl cursor-pointer"
          onClick={() => setShow(!show)}
        >
          <GiHamburgerMenu />
        </button>

        <div className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
          {renderLinks()}
        </div>
      </div>

      {show && (
        <div className="md:hidden px-6 pb-6 bg-white border-t border-gray-100 flex flex-col gap-4 font-medium text-gray-600">
          {renderLinks()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
