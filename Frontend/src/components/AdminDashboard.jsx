import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/doctors");
        setDoctors(res.data.doctors);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 md:px-8">
      <div className="w-full max-w-7xl bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">Admin Dashboard</h1>
          <Link
            to="/admin/register-doctor"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            + Register Doctor
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400 text-lg">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-lg">
            No doctors found.{" "}
            <Link to="/admin/register-doctor" className="text-indigo-600 underline">
              Click here to register one.
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {doctors.map((doc, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex flex-col items-center text-center shadow"
              >
                <img
                  src={
                    doc?.docAvatar?.url || doc?.docAvatar || "https://via.placeholder.com/150?text=No+Image"
                  }
                  alt="Doctor Avatar"
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800">
                  {doc.firstname} {doc.lastname}
                </h2>
                <p className="text-sm text-gray-600">Email: {doc.email}</p>
                <p className="text-sm text-gray-600">Phone: {doc.phone}</p>
                <p className="text-sm text-gray-600">NIC: {doc.nic}</p>
                <p className="text-sm text-gray-600">
                  DOB: {doc.dob ? new Date(doc.dob).toLocaleDateString() : "N/A"}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  Gender: {doc.gender}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Department: {doc.doctorDepartment || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
