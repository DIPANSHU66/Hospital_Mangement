import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserMd, FaSearch, FaFilter, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaSpinner } from "react-icons/fa";

const departmentArray = [
  "All",
  "Radiology", "Neurology", "Orthopedics", "Cardiology", "Gastroenterology",
  "Oncology", "Pediatrics", "Dermatology", "Internal Medicine", "Surgery",
  "Anesthesiology", "Ophthalmology", "Urology", "Pulmonology", "Endocrinology",
  "Rheumatology", "Hematology", "Nephrology", "Psychiatry", "Emergency Medicine",
  "Obstetrics and Gynecology", "Pathology", "Rehabilitation", "Family Medicine",
  "Addiction Medicine", "Sports Medicine", "Infectious Diseases", "Immunology",
  "Plastic Surgery", "Vascular Surgery", "Thoracic Surgery", "General Surgery",
  "Transplant Surgery", "Critical Care", "Genetics", "Pain Management",
  "Palliative Care", "Pharmacology", "Sleep Medicine", "Geriatrics",
  "Nuclear Medicine", "Fetal Medicine", "Audiology", "Speech Pathology",
  "Reproductive Endocrinology", "Neurocritical Care",
];

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/doctors`);
        setDoctors(res.data.doctors || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors list
  const filteredDoctors = doctors.filter((doc) => {
    const name = `${doc.firstname} ${doc.lastname}`.toLowerCase();
    const dept = (doc.doctorDepartment || "").toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase());
    
    if (selectedDept === "All") return matchesSearch;
    return matchesSearch && dept === selectedDept.toLowerCase();
  });

  return (
    <section className="min-h-screen bg-gray-50/50 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto mt-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
            Our Specialists
          </span>
          <h2 className="text-4xl font-extrabold text-gray-950 mt-3 tracking-tight">
            Meet Our Medical Team
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            View profiles and verify specialties of our highly qualified medical professionals.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-gray-150 p-4 rounded-2xl shadow-sm mb-8">
          <div className="relative w-full md:max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctor by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition"
            />
          </div>

          <div className="w-full md:max-w-xs flex items-center gap-2">
            <FaFilter className="text-gray-400 flex-shrink-0" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition cursor-pointer font-medium text-gray-750"
            >
              {departmentArray.map((dept, i) => (
                <option key={i} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
            <span className="text-gray-500">Loading specialist profiles...</span>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <FaUserMd className="text-gray-300 text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No Doctors Available</h3>
            <p className="text-gray-550 text-sm mt-1">
              There are no medical profiles matching the selected department and search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc, index) => (
              <div
                key={index}
                className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Name */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        doc?.docAvatar?.url ||
                        doc?.docAvatar ||
                        "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt="Doctor Avatar"
                      className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-850">
                        Dr. {doc.firstname} {doc.lastname}
                      </h3>
                      <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-md mt-1 border border-indigo-100/50">
                        {doc.doctorDepartment || "General Medicine"}
                      </span>
                    </div>
                  </div>

                  <hr className="border-gray-100 my-5" />

                  {/* Info list */}
                  <div className="space-y-2.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <span>{doc.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <span>{doc.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaIdCard className="text-gray-400" />
                      <span>NIC: {doc.nic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>
                        DOB: {doc.dob ? new Date(doc.dob).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <a
                    href="/Appointment"
                    className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs shadow hover:shadow-indigo-550/15 transition"
                  >
                    Request Appointment
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsList;
