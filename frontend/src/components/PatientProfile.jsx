import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUserMd,
  FaCalendarCheck,
  FaComments,
  FaPaperPlane,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaRegQuestionCircle,
  FaSpinner
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const PatientProfile = () => {
  const user = useSelector((state) => state.auth.user);
  
  // State for appointments
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [apptSearch, setApptSearch] = useState("");
  const [apptFilter, setApptFilter] = useState("All");

  // State for inquiries/chat
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(true);
  const [newMessageText, setNewMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments"); // 'appointments' or 'support'
  const [selectedChannel, setSelectedChannel] = useState("Admin");

  const getUniqueDoctors = () => {
    const map = new Map();
    appointments.forEach((appt) => {
      if (appt.doctor_id && appt.doctor) {
        map.set(appt.doctor_id, {
          id: appt.doctor_id,
          firstname: appt.doctor.firstname,
          lastname: appt.doctor.lastname,
          department: appt.department,
        });
      }
    });
    return Array.from(map.values());
  };

  const uniqueDoctors = getUniqueDoctors();
  const doctorIds = uniqueDoctors.map((d) => d.id);

  const filteredMessagesByChannel = messages.filter((msg) => {
    if (selectedChannel === "Admin") {
      return !doctorIds.includes(msg.receiver) && !doctorIds.includes(msg.sender);
    } else {
      return msg.sender === selectedChannel || msg.receiver === selectedChannel;
    }
  });

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/appointment/appointmentget`,
        { withCredentials: true }
      );
      setAppointments(res.data.appointments || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoadingAppts(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/message/getall`,
        { withCredentials: true }
      );
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/appointment/delete/${id}`,
        { withCredentials: true }
      );
      toast.success("Appointment cancelled successfully");
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    }
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    setSendingMessage(true);
    try {
      const url = selectedChannel === "Admin"
        ? `${import.meta.env.VITE_API_URL}/message/send`
        : `${import.meta.env.VITE_API_URL}/message/send/${selectedChannel}`;

      const res = await axios.post(
        url,
        { message: newMessageText.trim() },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      
      toast.success("Message sent successfully!");
      setNewMessageText("");
      // Refresh message list
      fetchMessages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchAppointments();
      fetchMessages();
    }
  }, [user]);

  // Filtering logic for appointments
  const filteredAppointments = appointments.filter((appt) => {
    const docName = `Dr. ${appt.doctor?.firstname} ${appt.doctor?.lastname}`.toLowerCase();
    const dept = (appt.department || "").toLowerCase();
    const searchMatch =
      docName.includes(apptSearch.toLowerCase()) || dept.includes(apptSearch.toLowerCase());

    if (apptFilter === "All") return searchMatch;
    if (apptFilter === "Visited") return searchMatch && appt.hasVisited;
    return searchMatch && appt.status === apptFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
      {/* Patient Header Card */}
      <div className="max-w-7xl mx-auto mt-6 bg-white border border-gray-150 rounded-3xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        {/* Background Accent Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2"></div>

        {/* Profile Avatar */}
        <div className="relative">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt="Patient Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-md"
            />
          ) : (
            <div className="w-32 h-32 bg-indigo-55 text-indigo-700 rounded-full flex items-center justify-center text-4xl font-extrabold border-4 border-indigo-500 shadow-md">
              {user?.firstname?.[0]?.toUpperCase() || "P"}
            </div>
          )}
          <span className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-green-500 border-4 border-white animate-pulse"></span>
        </div>

        {/* Profile Details */}
        <div className="text-center md:text-left flex-1 space-y-4">
          <div>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Patient Portal
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
              {user?.firstname} {user?.lastname}
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2.5 gap-x-6 text-sm text-gray-650">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <FaEnvelope className="text-indigo-55" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <FaPhone className="text-indigo-55" />
              <span>{user?.phone || "N/A"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <FaClock className="text-indigo-55" />
              <span>DOB: {user?.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-semibold text-gray-500">Gender:</span>
              <span className="capitalize">{user?.gender || "N/A"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-semibold text-gray-500">NIC:</span>
              <span>{user?.nic || "N/A"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-semibold text-gray-500">Joined:</span>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="max-w-7xl mx-auto mt-10">
        <div className="flex gap-4 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeTab === "appointments"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                : "text-gray-650 hover:bg-gray-100"
            }`}
          >
            <FaCalendarCheck />
            My Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab("support")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeTab === "support"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                : "text-gray-650 hover:bg-gray-100"
            }`}
          >
            <FaComments />
            Support Helpdesk ({messages.length})
          </button>
        </div>

        {/* Tab Content 1: Appointments */}
        {activeTab === "appointments" && (
          <div className="mt-8 space-y-6">
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-gray-150 p-4 rounded-2xl shadow-sm">
              <div className="relative w-full sm:max-w-md">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor or specialty..."
                  value={apptSearch}
                  onChange={(e) => setApptSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                {["All", "Pending", "Accepted", "Rejected", "Visited"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setApptFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition cursor-pointer ${
                      apptFilter === status
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {loadingAppts ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
                <span className="text-gray-500">Loading appointments...</span>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
                <FaCalendarCheck className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">No Appointments Found</h3>
                <p className="text-gray-550 text-sm mt-1">
                  You don't have any appointments matching the selected filters.
                </p>
                <a
                  href="/Appointment"
                  className="inline-block mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md transition"
                >
                  Book New Appointment
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAppointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 hover:shadow-md transition duration-300 flex flex-col justify-between"
                  >
                    {/* Header Info */}
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            Dr. {appt.doctor?.firstname} {appt.doctor?.lastname}
                          </h3>
                          <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-md mt-1">
                            {appt.department}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteAppointment(appt._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                          title="Cancel Appointment"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>

                      {/* Details List */}
                      <div className="mt-5 space-y-2.5 text-sm text-gray-650">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          <span>
                            <strong>Date:</strong> {new Date(appt.appointment_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400" />
                          <span>
                            <strong>Phone:</strong> {appt.phone}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <FaMapMarkerAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Address:</strong> {appt.address}
                          </span>
                        </div>
                      </div>

                      {/* Visual Stepper Timeline */}
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                          Status Timeline
                        </h4>
                        
                        <div className="flex items-center justify-between relative px-2">
                          {/* Progress Line Background */}
                          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-200 -translate-y-1/2 -z-10"></div>
                          
                          {/* Dynamic colored line */}
                          <div
                            className={`absolute top-1/2 left-4 -translate-y-1/2 h-0.5 -z-10 transition-all duration-500
                              ${appt.hasVisited ? "w-[90%] bg-blue-500" : ""}
                              ${!appt.hasVisited && appt.status === "Accepted" ? "w-[50%] bg-green-500" : ""}
                              ${!appt.hasVisited && appt.status === "Rejected" ? "w-[50%] bg-red-500" : ""}
                              ${!appt.hasVisited && appt.status === "Pending" ? "w-[15%] bg-amber-500" : ""}
                            `}
                          ></div>

                          {/* Step 1: Requested */}
                          <div className="flex flex-col items-center">
                            <span className="w-5 h-5 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center shadow"></span>
                            <span className="text-[10px] font-bold text-amber-600 mt-1.5 uppercase">Requested</span>
                          </div>

                          {/* Step 2: Approved / Rejected */}
                          <div className="flex flex-col items-center">
                            <span
                              className={`w-5 h-5 rounded-full border-4 border-white flex items-center justify-center shadow transition duration-300
                                ${
                                  appt.status === "Accepted"
                                    ? "bg-green-500"
                                    : appt.status === "Rejected"
                                    ? "bg-red-500"
                                    : "bg-gray-300"
                                }
                              `}
                            ></span>
                            <span
                              className={`text-[10px] font-bold mt-1.5 uppercase transition duration-300
                                ${
                                  appt.status === "Accepted"
                                    ? "text-green-600"
                                    : appt.status === "Rejected"
                                    ? "text-red-600"
                                    : "text-gray-400"
                                }
                              `}
                            >
                              {appt.status === "Rejected" ? "Rejected" : "Approved"}
                            </span>
                          </div>

                          {/* Step 3: Visited */}
                          <div className="flex flex-col items-center">
                            <span
                              className={`w-5 h-5 rounded-full border-4 border-white flex items-center justify-center shadow transition duration-300
                                ${appt.hasVisited ? "bg-blue-500" : "bg-gray-300"}
                              `}
                            ></span>
                            <span
                              className={`text-[10px] font-bold mt-1.5 uppercase transition duration-300
                                ${appt.hasVisited ? "text-blue-650" : "text-gray-400"}
                              `}
                            >
                              Visited
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Message Doctor shortcut button */}
                      <button
                        onClick={() => {
                          setSelectedChannel(appt.doctor_id);
                          setActiveTab("support");
                        }}
                        className="w-full mt-6 bg-indigo-55 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <FaComments />
                        Message Doctor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Support Helpdesk */}
        {activeTab === "support" && (
          <div className="mt-8 bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-[600px]">
            {/* Sidebar Channels list */}
            <div className="w-full md:w-80 bg-gray-50 border-r border-gray-150 flex-shrink-0 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-gray-150 bg-white">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <FaComments className="text-indigo-600" />
                  Chat Channels
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {/* Admin channel button */}
                <button
                  onClick={() => setSelectedChannel("Admin")}
                  className={`w-full text-left p-3.5 rounded-xl transition cursor-pointer flex flex-col gap-1 border ${
                    selectedChannel === "Admin"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <span className="font-bold text-sm">General Helpdesk</span>
                  <span className={`text-[10px] ${selectedChannel === "Admin" ? "text-indigo-200" : "text-gray-400"}`}>
                    Talk to Admin Staff
                  </span>
                </button>

                {/* Separator if we have doctors */}
                {uniqueDoctors.length > 0 && (
                  <div className="px-3 pt-3 pb-1">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                      Your Booked Doctors
                    </span>
                  </div>
                )}

                {/* Doctor channel buttons */}
                {uniqueDoctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedChannel(doc.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition cursor-pointer flex flex-col gap-1 border ${
                      selectedChannel === doc.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-bold text-sm">Dr. {doc.firstname} {doc.lastname}</span>
                    <span className={`text-[10px] font-semibold ${selectedChannel === doc.id ? "text-indigo-200" : "text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-max"}`}>
                      {doc.department}
                    </span>
                  </button>
                ))}
              </div>
              <div className="p-4 bg-gray-100 border-t border-gray-200 text-xs text-gray-400 font-medium">
                Connected as {user?.firstname}
              </div>
            </div>

            {/* Chat Board */}
            <div className="flex-1 flex flex-col justify-between bg-white h-full overflow-hidden">
              {/* Message log */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {loadingChat ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
                    <span className="text-sm text-gray-500">Loading chat history...</span>
                  </div>
                ) : filteredMessagesByChannel.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                    <FaComments className="text-gray-300 text-5xl mb-3" />
                    <h4 className="text-base font-bold text-gray-800">No message history</h4>
                    <p className="text-gray-550 text-sm mt-1">
                      {selectedChannel === "Admin"
                        ? "Send your first message to the medical administration desk using the input below!"
                        : "Send a message to start chatting with your doctor!"}
                    </p>
                  </div>
                ) : (
                  filteredMessagesByChannel.map((msg) => {
                    const isSelf = msg.sender === user?._id;
                    return (
                      <div key={msg._id} className="space-y-2.5">
                        {/* The message itself */}
                        <div className={`flex items-start gap-2.5 max-w-[85%] ${isSelf ? "ml-auto justify-end" : "mr-auto justify-start"}`}>
                          {!isSelf && (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-150 flex items-center justify-center flex-shrink-0 shadow-sm text-indigo-600 text-xs font-extrabold">
                              {selectedChannel === "Admin" ? "AD" : "DR"}
                            </div>
                          )}
                          <div className="space-y-1">
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              isSelf 
                                ? "bg-indigo-600 text-white rounded-tr-none" 
                                : "bg-white text-gray-800 border border-gray-150 rounded-tl-none font-medium"
                            }`}>
                              <p>{msg.message}</p>
                            </div>
                            <span className={`block text-[10px] text-gray-400 font-medium ${isSelf ? "text-right" : "text-left"}`}>
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Render any reply inline */}
                        {msg.isReplied && msg.reply && (
                          <div className="flex items-start gap-2.5 justify-start max-w-[85%] mr-auto">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 shadow-sm text-emerald-600">
                              <FaUserMd />
                            </div>
                            <div className="space-y-1">
                              <div className="bg-emerald-50 text-emerald-900 border border-emerald-100 px-4 py-3 rounded-2xl rounded-tl-none text-sm leading-relaxed shadow-sm font-semibold">
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                                  Response
                                </span>
                                <p>{msg.reply}</p>
                              </div>
                              <span className="block text-[10px] text-gray-400 font-medium">
                                Replied {new Date(msg.repliedAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Field */}
              <form
                onSubmit={handleSendInquiry}
                className="p-4 border-t border-gray-150 bg-white flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder={
                    selectedChannel === "Admin"
                      ? "Type your question or query to admins here..."
                      : "Type your message to the doctor here..."
                  }
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition duration-200"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-95 transition flex items-center justify-center cursor-pointer flex-shrink-0"
                  disabled={sendingMessage || !newMessageText.trim()}
                >
                  {sendingMessage ? (
                    <FaSpinner className="animate-spin text-sm" />
                  ) : (
                    <FaPaperPlane className="text-sm" />
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
