import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllDoctors } from "../redux/doctorSlice";

const departmentArray = [
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

const AppointmentForm = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    appointment_date: "",
    department: "",
    doctor_firstname: "",
    doctor_lastname: "",
    address: "",
    hasVisited: false,
  });

  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctor.alldoctors);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "https://hospital-mangement-9amd.onrender.com/api/v1/user/doctors",
          { withCredentials: true }
        );
        dispatch(setAllDoctors(data.doctors || []));
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    if (!doctors || doctors.length === 0) fetchDoctors();
  }, [dispatch, doctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleappointment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://hospital-mangement-9amd.onrender.com/api/v1/appointment/post",
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error creating appointment"
      );
    }

    setForm({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      nic: "",
      dob: "",
      gender: "",
      appointment_date: "",
      department: "",
      doctor_firstname: "",
      doctor_lastname: "",
      address: "",
      hasVisited: false,
    });
  };

  const inputStyle =
    "w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-indigo-500 outline-none transition duration-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-6xl bg-white p-10 md:p-16 shadow-2xl rounded-3xl border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-2">
          Dipanshu Medical Institute ❤️
        </h2>
        <p className="text-center text-lg text-gray-600 mb-10">
          Fill in the form below to book your appointment
        </p>

        <form onSubmit={handleappointment} className="space-y-6 text-lg">

          {/* First & Last Name */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstname" value={form.firstname} onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastname" value={form.lastname} onChange={handleChange} required className={inputStyle} />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} required className={inputStyle} />
            </div>
          </div>

          {/* NIC & DOB */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">NIC</label>
              <input type="text" name="nic" value={form.nic} onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} required className={inputStyle} />
            </div>
          </div>

          {/* Gender & Appointment Date */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required className={inputStyle}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Appointment Date</label>
              <input type="date" name="appointment_date" value={form.appointment_date} onChange={handleChange} required className={inputStyle} />
            </div>
          </div>

          {/* Department & Doctor */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Department</label>
              <select name="department" value={form.department} onChange={handleChange} required className={inputStyle}>
                <option value="">Select Department</option>
                {departmentArray.map((dep, i) => (
                  <option key={i} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Doctor</label>
              <select
                value={`${form.doctor_firstname},${form.doctor_lastname}`}
                onChange={(e) => {
                  const [firstname, lastname] = e.target.value.split(",");
                  setForm((prev) => ({
                    ...prev,
                    doctor_firstname: firstname || "",
                    doctor_lastname: lastname || "",
                  }));
                }}
                className={inputStyle}
                disabled={!form.department}
              >
                <option value="">Select Doctor with Department</option>
                {doctors.filter((doc) => doc.doctorDepartment === form.department).length === 0 ? (
                  <option disabled>No doctor available in this department</option>
                ) : (
                  doctors
                    .filter((doc) => doc.doctorDepartment === form.department)
                    .map((doc, i) => (
                      <option key={i} value={`${doc.firstname},${doc.lastname}`}>
                        Dr. {doc.firstname} {doc.lastname}
                      </option>
                    ))
                )}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              rows="4"
              value={form.address}
              onChange={handleChange}
              className={`${inputStyle} resize-none`}
              required
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.hasVisited}
              onChange={(e) => setForm({ ...form, hasVisited: e.target.checked })}
              className="w-5 h-5"
            />
            <label>Have you visited before?</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 text-xl rounded-xl font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            BOOK APPOINTMENT
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
