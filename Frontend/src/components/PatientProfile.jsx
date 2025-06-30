import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const PatientProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 3 },
    desktop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/appointment/appointmentget",
        { withCredentials: true }
      );
      setAppointments(res.data.appointments);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/appointment/delete/${id}`,
        { withCredentials: true }
      );
      toast.success("Appointment deleted");
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete appointment"
      );
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchAppointments();
    }
  }, []);

  return (
    <div className="flex flex-col justify-center">
      <div className="h-[100px]"></div>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
        {/* Patient Profile Section */}
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8 border border-blue-200 mt-10">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt="Patient Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <div className="w-32 h-32 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-4xl font-extrabold border-4 border-blue-500">
              {user?.firstname?.[0]?.toUpperCase() || "P"}
            </div>
          )}

          <div className="text-center md:text-left w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {user?.firstname} {user?.lastname}
            </h1>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Phone:</span> {user?.phone || "N/A"}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Gender:</span> {user?.gender || "N/A"}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Date of Birth:</span>{" "}
              {user?.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">NIC:</span> {user?.nic || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Registered On:</span>{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Appointments Carousel */}
        <div className="w-full py-12 bg-gray-50 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-600 mb-8">
              My Appointments
            </h2>

            {loading ? (
              <p className="text-center text-gray-500 text-lg">
                Loading appointments...
              </p>
            ) : appointments.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">
                No appointments found.
              </p>
            ) : (
              <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={4000}
                arrows
                keyBoardControl
                draggable
                swipeable
                transitionDuration={600}
                customTransition="transform 600ms ease-in-out"
                itemClass="carousel-item-padding-40-px"
                containerClass="carousel-container"
              >
                {appointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="w-[90%] mx-auto bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition duration-300 p-4 min-h-[280px] flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Dr. {appt.doctor?.firstname || "Unknown"}{" "}
                        {appt.doctor?.lastname || ""}
                      </h3>
                      <p className="text-gray-600">
                        <strong>Date:</strong>{" "}
                        {new Date(appt.appointment_date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        <strong>Department:</strong> {appt.department || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`font-semibold ${
                            appt.status === "Pending"
                              ? "text-yellow-600"
                              : appt.status === "Approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        <strong>Visited:</strong> {appt.hasVisited ? "Yes" : "No"}
                      </p>
                      <p className="text-gray-600">
                        <strong>Phone no:</strong> {appt.phone}
                      </p>
                      <p className="text-gray-600">
                        <strong>Time:</strong> 7.00 AM - 8.00 PM
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(appt._id)}
                      className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow-sm transition duration-200 text-sm"
                    >
                      Delete Appointment
                    </button>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
