import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
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

const DoctorRegister = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    password: "",
    doctorDepartment: "",
  });

  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allDoctors = useSelector((state) => state.doctor.allDoctors); // ✅ Check reducer camelCase

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!avatar) return toast.error("Doctor avatar is required");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", avatar);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/doctor/addnew",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast.success("Doctor registered successfully");

        if (res.data.doctor) {
          dispatch(setAllDoctors([...allDoctors, res.data.doctor])); // ✅ Fixed syntax
        }

        navigate("/admin/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-5xl w-full bg-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
          Register New Doctor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="firstname"
              placeholder="First Name"
              value={form.firstname}
              onChange={handleChange}
              required
              className="border px-4 py-3 rounded-xl"
            />
            <input
              name="lastname"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
              required
              className="border px-4 py-3 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="border px-4 py-3 rounded-xl"
            />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="border px-4 py-3 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="nic"
              placeholder="NIC"
              value={form.nic}
              onChange={handleChange}
              required
              className="border px-4 py-3 rounded-xl"
            />
            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
              className="border px-4 py-3 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="border px-4 py-3 rounded-xl"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="border px-4 py-3 rounded-xl bg-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <select
            name="doctorDepartment"
            value={form.doctorDepartment}
            onChange={handleChange}
            required
            className="w-full border px-4 py-3 rounded-xl bg-white"
          >
            <option value="">Select Department</option>
            {departmentArray.map((dept, idx) => (
              <option key={idx} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <input
            name="docAvatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            required
            className="w-full border px-4 py-3 rounded-xl bg-white"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition"
          >
            Register Doctor
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegister;
