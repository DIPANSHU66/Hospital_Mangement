import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaLocationArrow } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const hours = [
    { id: 1, day: "Mon", time: "9:00 AM - 11:00 PM" },
    { id: 2, day: "Tue", time: "12:00 PM - 12:00 AM" },
    { id: 3, day: "Wed", time: "10:00 AM - 10:00 PM" },
    { id: 4, day: "Thurs", time: "9:00 AM - 9:00 PM" },
    { id: 5, day: "Frid", time: "3:00 PM - 9:00 PM" },
    { id: 6, day: "Satur", time: "9:00 AM - 3:00 PM" },
  ];

  return (
    <footer className="bg-gradient-to-tr from-white via-blue-50 to-white py-12 px-6 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo */}
        <div className="flex flex-col items-start">
          <img
            src="https://th.bing.com/th/id/OIP.rvPi9g5eBUJkgoS1rC3x0AHaHa?w=171&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7"
            alt="Logo"
            className="w-20 h-20 object-cover mb-4"
          />
          <p className="text-base font-medium text-gray-700">
            Dipanshu Medical Institute
          </p>
          <p className="text-sm text-gray-500 mt-2">Healing with compassion 💙</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-indigo-700">Quick Links</h4>
          <ul className="space-y-2 text-gray-700 text-base">
            <li>
              <Link to="/" className="hover:text-indigo-500 transition">Home</Link>
            </li>
            <li>
              <Link to="/appointment" className="hover:text-indigo-500 transition">Appointment</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-500 transition">About</Link>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-indigo-700">Hours</h4>
          <ul className="space-y-1 text-base text-gray-600">
            {hours.map(({ id, day, time }) => (
              <li key={id} className="flex justify-between">
                <span>{day}</span>
                <span className="text-gray-500">{time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-indigo-700">Contact</h4>
          <div className="flex items-center gap-3 text-gray-700 mb-2">
            <FaPhone className="text-indigo-500" />
            <span>+91-999-999-9999</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 mb-2">
            <MdEmail className="text-indigo-500" />
            <span>dipanshu@caregmail.com</span>
          </div>
          <div className="flex items-start gap-3">
            <FaLocationArrow className="text-indigo-500 mt-1" />
            <div className="flex flex-wrap gap-2">
              {["India", "USA", "UK", "New York", "Dubai", "France"].map((place, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
                >
                  {place}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm border-t pt-6">
        &copy; {new Date().getFullYear()} Dipanshu Medical Institute. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
