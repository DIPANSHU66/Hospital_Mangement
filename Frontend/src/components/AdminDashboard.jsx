import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <section className="w-full min-h-screen py-20 bg-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700">Admin Dashboard</h2>
          <Link
            to="/admin/register-doctor"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            + Register Doctor
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading doctors...</div>
        ) : doctors.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No doctors found.{" "}
            <Link to="/admin/register-doctor" className="text-indigo-600 underline">
              Click here to register one.
            </Link>
          </div>
        ) : (
          <Carousel
            responsive={responsive}
            infinite
            autoPlay
            autoPlaySpeed={3000}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            itemClass="px-3 flex justify-center"
          >
            {doctors.map((doc, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition duration-300 p-6 text-center w-full max-w-sm"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={
                      doc?.docAvatar?.url ||
                      doc?.docAvatar ||
                      "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt="Doctor Avatar"
                    className="w-28 h-28 rounded-full object-cover border"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {doc.firstname} {doc.lastname}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Email: {doc.email}</p>
                <p className="text-sm text-gray-600">Phone: {doc.phone}</p>
                <p className="text-sm text-gray-600">NIC: {doc.nic}</p>
                <p className="text-sm text-gray-600">
                  DOB: {doc.dob ? new Date(doc.dob).toLocaleDateString() : "N/A"}
                </p>
                <p className="text-sm text-gray-600 capitalize">Gender: {doc.gender}</p>
                <p className="text-sm text-indigo-700 font-medium">
                  Department: {doc.doctorDepartment || "N/A"}
                </p>
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
