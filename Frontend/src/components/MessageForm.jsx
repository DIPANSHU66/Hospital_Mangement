import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MessageForm = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/message/send",
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message);
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Message sending failed");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-12">
        <h2 className="text-4xl font-bold text-indigo-700 text-center mb-10">
          Send Us a Message 💬
        </h2>

        <form onSubmit={handleMessage} className="space-y-8">
          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="First Name"
              value={form.firstname}
              onChange={(e) =>
                setForm({ ...form, firstname: e.target.value })
              }
              className="p-4 border border-gray-300 rounded-lg text-lg w-full"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={form.lastname}
              onChange={(e) =>
                setForm({ ...form, lastname: e.target.value })
              }
              className="p-4 border border-gray-300 rounded-lg text-lg w-full"
              required
            />
          </div>

          {/* Email and phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-4 border border-gray-300 rounded-lg text-lg w-full"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-4 border border-gray-300 rounded-lg text-lg w-full"
              required
            />
          </div>

          {/* Message */}
          <textarea
            rows="6"
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg text-lg"
            required
          ></textarea>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-md transition duration-300"
            >
              Submit Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default MessageForm;
