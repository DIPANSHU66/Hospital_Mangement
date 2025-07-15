import React, { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("https://hospital-mangement-9amd.onrender.com/api/v1/user/doctors");
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
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
    },
  };

  return (
    <section className="w-full min-h-screen py-16 bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full px-4">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
          Meet Our Doctors
        </h2>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading doctors...</div>
        ) : doctors.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No doctors available right now.</div>
        ) : (
          <Carousel
            responsive={responsive}
            infinite
            autoPlay
            autoPlaySpeed={3500}
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

export default DoctorsList;
