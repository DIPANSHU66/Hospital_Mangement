import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

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
    "Reproductive Endocrinology", "Neurocritical Care"
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/v1/user/doctors", {
          withCredentials: true,
        });
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleappointment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/appointment/post",
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
      toast.error(error.response?.data?.message || "Error creating appointment");
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
       
          <div className="grid md:grid-cols-2 gap-6">
            <input type="text" name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange} required className="input" />
            <input type="text" name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleChange} required className="input" />
          </div>

     
          <div className="grid md:grid-cols-2 gap-6">
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="input" />
            <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="input" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input type="text" name="nic" placeholder="NIC" value={form.nic} onChange={handleChange} required className="input" />
            <input type="date" name="dob" value={form.dob} onChange={handleChange} required className="input" />
          </div>


          <div className="grid md:grid-cols-2 gap-6">
            <select name="gender" value={form.gender} onChange={handleChange} required className="input">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input type="date" name="appointment_date" value={form.appointment_date} onChange={handleChange} required className="input" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <select name="department" value={form.department} onChange={handleChange} required className="input">
              <option value="">Select Department</option>
              {departmentArray.map((dep, i) => (
                <option key={i} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
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
              className="input"
              disabled={!form.department}
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter((doc) => doc.doctorDepartment === form.department)
                .map((doc, i) => (
                  <option key={i} value={`${doc.firstname},${doc.lastname}`}>
                    Dr. {doc.firstname} {doc.lastname}
                  </option>
                ))}
            </select>
          </div>

          <textarea
            name="address"
            rows="4"
            placeholder="Your Full Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 px-5 py-3 rounded-xl focus:ring-2 focus:ring-green-500"
            required
          />

     
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.hasVisited}
              onChange={(e) => setForm({ ...form, hasVisited: e.target.checked })}
              className="w-5 h-5"
            />
            <label>Have you visited before?</label>
          </div>

        
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
