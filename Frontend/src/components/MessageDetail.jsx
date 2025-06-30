import React, { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const MessageDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const receiverName = location.state?.name || "User";
  const receiverRole = location.state?.role || "Recipient";

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${id}`,
        { ...form },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data.message || "Message sent successfully");

      setForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-10">
        <div className="mb-6">
          <Link
            to="/admin/messages"
            className="text-indigo-600 hover:underline font-medium"
          >
            &larr; Back to Messages
          </Link>
        </div>

        <h2 className="text-4xl font-bold text-indigo-700 text-center mb-2">
          Send a Message
        </h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          To <span className="text-indigo-700 font-semibold">{receiverName}</span>{" "}
          <span className="text-sm text-gray-500 font-medium">({receiverRole})</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Your First Name"
              value={form.firstname}
              onChange={(e) => setForm({ ...form, firstname: e.target.value })}
              className="p-4 border border-gray-300 rounded-lg text-lg w-full"
              required
            />
            <input
              type="text"
              placeholder="Your Last Name"
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              className="p-4 border border-gray-300 rounded-lg text-lg w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-4 border border-gray-300 rounded-lg text-lg w-full"
              required
            />
            <input
              type="tel"
              placeholder="Your Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-4 border border-gray-300 rounded-lg text-lg w-full"
              required
            />
          </div>

          <textarea
            rows="6"
            placeholder="Write your message here..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg text-lg"
            required
          ></textarea>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-md transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default MessageDetail;
