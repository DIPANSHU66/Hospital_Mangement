import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MdDelete } from "react-icons/md";
const DoctorProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 3 },
    desktop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          "https://hospital-mangement-9amd.onrender.com/api/v1/appointment/appointmentget",
          { withCredentials: true }
        );
        setAppointments(res.data.appointments || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/appointment/update/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success("Appointment status updated");
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: newStatus } : appt
        )
      );
    } catch (error) {
      toast.error("Failed to update appointment status");
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

  return (
    <div className="flex flex-col justify-center">
      <div className="h-[100px]"></div>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
        {/* Doctor Info */}
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8 border border-blue-200 mt-10">
          {user?.docAvatar?.url ? (
            <img
              src={user.docAvatar.url}
              alt="Doctor Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <div className="w-32 h-32 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-4xl font-extrabold border-4 border-blue-500">
              {user?.firstname?.[0]?.toUpperCase() || "D"}
            </div>
          )}

          <div className="text-center md:text-left w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dr. {user?.firstname} {user?.lastname}
            </h1>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Phone:</span> {user?.phone || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Department:</span>{" "}
              {user?.doctorDepartment || "N/A"}
            </p>
          </div>
        </div>

        {/* Appointments */}
        <div className="w-full py-12 bg-gray-50 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-600 mb-8">
              Patient Appointments
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
                arrows
                keyBoardControl
                autoPlay
                autoPlaySpeed={3000}
                swipeable
                draggable
                transitionDuration={500}
                customTransition="transform 500ms ease-in-out"
                itemClass="px-3"
                containerClass="carousel-container"
              >
                {appointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="relative bg-white border border-gray-200 rounded-xl shadow-md p-4 h-[560px] w-[360px] flex flex-col justify-between"
                  >
                    <button
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(appt._id)}
                      title="Delete Appointment"
                    >
                      <MdDelete size={20} />
                    </button>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {appt.firstname} {appt.lastname}
                    </h3>
                    <p className="text-gray-600">
                      <strong>Date:</strong>{" "}
                      {new Date(appt.appointment_date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <strong>Department:</strong> {appt.department}
                    </p>
                    <p className="text-gray-600">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          appt.status === "Pending"
                            ? "text-yellow-600"
                            : appt.status === "Accepted"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {appt.phone}
                    </p>
                    <p className="text-gray-600">
                      <strong>Email:</strong> {appt.email}
                    </p>
                    <p className="text-gray-600">
                      <strong>NIC:</strong> {appt.nic}
                    </p>
                    <p className="text-gray-600">
                      <strong>DOB:</strong>{" "}
                      {appt.dob
                        ? new Date(appt.dob).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <strong>Gender:</strong> {appt.gender}
                    </p>
                    <p className="text-gray-600">
                      <strong>Visited:</strong> {appt.hasVisited ? "Yes" : "No"}
                    </p>
                    <p className="text-gray-600">
                      <strong>Address:</strong> {appt.address || "N/A"}
                    </p>

                    {/* Dropdown for status update */}
                    <div className="mt-4">
                      <select
                        className={`w-full px-3 py-2 rounded-md border text-sm font-medium shadow-sm focus:outline-none transition
                          ${
                            appt.status === "Pending"
                              ? "bg-yellow-50 text-yellow-800 border-yellow-300 focus:ring-yellow-300"
                              : appt.status === "Accepted"
                              ? "bg-green-50 text-green-800 border-green-300 focus:ring-green-300"
                              : "bg-red-50 text-red-800 border-red-300 focus:ring-red-300"
                          }`}
                        value={appt.status}
                        onChange={(e) =>
                          handleStatusChange(appt._id, e.target.value)
                        }
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="Accepted">✅ Accepted</option>
                        <option value="Rejected">❌ Rejected</option>
                      </select>
                    </div>
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

export default DoctorProfile;
