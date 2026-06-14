import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClipboardList,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaUser,
  FaRegCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaSpinner,
  FaComments,
  FaPaperPlane
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const DoctorProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // State variables for Tab navigation and Patient messaging
  const [activeTab, setActiveTab] = useState("appointments");
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(true);
  const [selectedPatientChannel, setSelectedPatientChannel] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/appointment/appointmentget`,
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

  useEffect(() => {
    fetchAppointments();
    fetchMessages();
  }, []);

  const getUniquePatients = () => {
    const map = new Map();
    appointments.forEach((appt) => {
      if (appt.patientId) {
        map.set(appt.patientId, {
          id: appt.patientId,
          firstname: appt.firstname,
          lastname: appt.lastname,
          email: appt.email,
          phone: appt.phone,
        });
      }
    });
    messages.forEach((msg) => {
      if (msg.sender && msg.sender !== user?._id && msg.receiver === user?._id) {
        if (!map.has(msg.sender)) {
          map.set(msg.sender, {
            id: msg.sender,
            firstname: msg.firstname,
            lastname: msg.lastname,
            email: msg.email,
            phone: msg.phone,
          });
        }
      }
      if (msg.receiver && msg.receiver !== user?._id && msg.sender === user?._id) {
        if (!map.has(msg.receiver)) {
          map.set(msg.receiver, {
            id: msg.receiver,
            firstname: msg.firstname,
            lastname: msg.lastname,
            email: msg.email,
            phone: msg.phone,
          });
        }
      }
    });
    return Array.from(map.values());
  };

  const uniquePatients = getUniquePatients();

  useEffect(() => {
    if (!selectedPatientChannel && uniquePatients.length > 0) {
      setSelectedPatientChannel(uniquePatients[0].id);
    }
  }, [uniquePatients, selectedPatientChannel]);

  const filteredMessagesByPatient = messages.filter((msg) => {
    return (
      (msg.sender === user?._id && msg.receiver === selectedPatientChannel) ||
      (msg.sender === selectedPatientChannel && msg.receiver === user?._id)
    );
  });

  const handleSendMessageToPatient = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedPatientChannel) return;

    setSendingMessage(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/message/send/${selectedPatientChannel}`,
        { message: newMessageText.trim() },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      toast.success("Message sent successfully!");
      setNewMessageText("");
      fetchMessages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/appointment/update/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Appointment status updated to ${newStatus}`);
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
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/appointment/delete/${id}`,
        { withCredentials: true }
      );
      toast.success("Appointment deleted successfully");
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete appointment"
      );
    }
  };

  // Compute analytics
  const totalAppts = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const acceptedCount = appointments.filter((a) => a.status === "Accepted").length;
  const rejectedCount = appointments.filter((a) => a.status === "Rejected").length;

  // Filter appointments
  const filteredAppointments = appointments.filter((appt) => {
    const patientName = `${appt.firstname} ${appt.lastname}`.toLowerCase();
    const matchesSearch = patientName.includes(searchQuery.toLowerCase());
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && appt.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
      {/* Doctor Header Card */}
      <div className="max-w-7xl mx-auto mt-6 bg-white border border-gray-150 rounded-3xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        {/* Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        
        {user?.docAvatar?.url ? (
          <img
            src={user.docAvatar.url}
            alt="Doctor Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-md flex-shrink-0"
          />
        ) : (
          <div className="w-32 h-32 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center text-4xl font-extrabold border-4 border-indigo-500 shadow-md flex-shrink-0">
            {user?.firstname?.[0]?.toUpperCase() || "D"}
          </div>
        )}

        <div className="text-center md:text-left flex-1 space-y-4">
          <div>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Doctor Workspace
            </span>
            <h1 className="text-3xl font-extrabold text-gray-950 mt-2">
              Dr. {user?.firstname} {user?.lastname}
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-indigo-55" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-indigo-55" />
              <span>{user?.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-500">Department:</span>
              <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-md text-xs border border-emerald-100">
                {user?.doctorDepartment || "General"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Appointments</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-black text-gray-900">{totalAppts}</span>
            <span className="bg-gray-100 text-gray-750 px-2 py-0.5 rounded text-xs font-bold">All</span>
          </div>
        </div>
        <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Pending Review</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-black text-amber-600">{pendingCount}</span>
            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">Awaiting</span>
          </div>
        </div>
        <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Accepted</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-black text-green-600">{acceptedCount}</span>
            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Approved</span>
          </div>
        </div>
        <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Rejected</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-black text-red-600">{rejectedCount}</span>
            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-bold">Declined</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation header */}
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
            <FaCalendarAlt />
            My Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeTab === "messages"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                : "text-gray-650 hover:bg-gray-100"
            }`}
          >
            <FaComments />
            Patient Messages ({uniquePatients.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Appointments List */}
      {activeTab === "appointments" && (
        <div className="max-w-7xl mx-auto mt-6 space-y-6 animate-fadeIn">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-gray-150 p-4 rounded-2xl shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {["All", "Pending", "Accepted", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                    statusFilter === status
                      ? "bg-indigo-55 text-indigo-700 border-indigo-200"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Appointment Grid */}
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
              <span className="text-gray-500">Loading appointments...</span>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
              <FaClipboardList className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800">No Appointments Found</h3>
              <p className="text-gray-550 text-sm mt-1">
                There are no patient records matching your active filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white border border-gray-150 rounded-2xl shadow-sm p-6 hover:shadow-md transition duration-300 relative flex flex-col justify-between"
                >
                  {/* Delete button */}
                  <button
                    className="absolute top-4 right-4 text-red-400 hover:text-red-655 hover:bg-red-50 p-1.5 rounded-lg transition"
                    onClick={() => handleDelete(appt._id)}
                    title="Delete Appointment"
                  >
                    <MdDelete size={20} />
                  </button>

                  <div className="space-y-4">
                    {/* Header info */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 pr-6">
                        {appt.firstname} {appt.lastname}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="bg-gray-100 text-gray-655 text-xs font-semibold px-2 py-0.5 rounded">
                          {appt.gender}
                        </span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-500 text-xs">
                          Age: {appt.dob ? new Date().getFullYear() - new Date(appt.dob).getFullYear() : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-100" />

                    {/* Details */}
                    <div className="space-y-2.5 text-sm text-gray-655">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>
                          <strong>Appt Date:</strong> {new Date(appt.appointment_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        <span>{appt.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        <span className="truncate">{appt.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-400">NIC:</span>
                        <span>{appt.nic}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-400">Visited before:</span>
                        <span className={`font-medium ${appt.hasVisited ? "text-blue-600" : "text-gray-500"}`}>
                          {appt.hasVisited ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{appt.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Selection and Pill */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border
                        ${
                          appt.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : appt.status === "Accepted"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-red-50 text-red-700 border-red-100"
                        }
                      `}
                    >
                      {appt.status}
                    </span>

                    {/* Select Status */}
                    <div className="flex-1 max-w-[140px]">
                      <select
                        className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold focus:outline-none transition cursor-pointer
                          ${
                            appt.status === "Pending"
                              ? "bg-amber-50 text-amber-800 border-amber-200 focus:ring-1 focus:ring-amber-300"
                              : appt.status === "Accepted"
                              ? "bg-green-50 text-green-800 border-green-200 focus:ring-1 focus:ring-green-300"
                              : "bg-red-50 text-red-800 border-red-200 focus:ring-1 focus:ring-red-300"
                          }
                        `}
                        value={appt.status}
                        onChange={(e) =>
                          handleStatusChange(appt._id, e.target.value)
                        }
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="Accepted">✅ Accept</option>
                        <option value="Rejected">❌ Reject</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Patient Messages */}
      {activeTab === "messages" && (
        <div className="max-w-7xl mx-auto mt-6 bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-[600px] animate-fadeIn">
          {/* Sidebar Channels list */}
          <div className="w-full md:w-80 bg-gray-50 border-r border-gray-150 flex-shrink-0 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-150 bg-white">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <FaComments className="text-indigo-600" />
                Patient Channels
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {uniquePatients.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400 font-semibold">
                  No patients found.
                </div>
              ) : (
                uniquePatients.map((pat) => {
                  return (
                    <button
                      key={pat.id}
                      onClick={() => setSelectedPatientChannel(pat.id)}
                      className={`w-full text-left p-3.5 rounded-xl transition cursor-pointer flex flex-col gap-1 border ${
                        selectedPatientChannel === pat.id
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span className="font-bold text-sm">
                        {pat.firstname} {pat.lastname}
                      </span>
                      <span className={`text-[10px] ${selectedPatientChannel === pat.id ? "text-indigo-200" : "text-gray-500"}`}>
                        {pat.email}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
            <div className="p-4 bg-gray-100 border-t border-gray-200 text-xs text-gray-400 font-medium">
              Workspace: Dr. {user?.firstname}
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
              ) : !selectedPatientChannel ? (
                <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                  <FaComments className="text-gray-300 text-5xl mb-3" />
                  <h4 className="text-base font-bold text-gray-800">Select a Patient</h4>
                  <p className="text-gray-550 text-sm mt-1">
                    Choose a patient channel from the sidebar to view conversation history.
                  </p>
                </div>
              ) : filteredMessagesByPatient.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                  <FaComments className="text-gray-300 text-5xl mb-3" />
                  <h4 className="text-base font-bold text-gray-800">No message history</h4>
                  <p className="text-gray-550 text-sm mt-1">
                    Start the conversation by sending a direct message to this patient using the input below!
                  </p>
                </div>
              ) : (
                filteredMessagesByPatient.map((msg) => {
                  const isSelf = msg.sender === user?._id;
                  return (
                    <div key={msg._id} className="space-y-2.5">
                      {/* The message itself */}
                      <div className={`flex items-start gap-2.5 max-w-[85%] ${isSelf ? "ml-auto justify-end" : "mr-auto justify-start"}`}>
                        {!isSelf && (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-150 flex items-center justify-center flex-shrink-0 shadow-sm text-indigo-600 text-xs font-extrabold">
                            PT
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
                        <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === user?._id ? "ml-auto justify-end" : "mr-auto justify-start"}`}>
                          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 shadow-sm text-emerald-600">
                            <FaUserMd />
                          </div>
                          <div className="space-y-1">
                            <div className="bg-emerald-50 text-emerald-900 border border-emerald-100 px-4 py-3 rounded-2xl rounded-tl-none text-sm leading-relaxed shadow-sm font-semibold">
                              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                                Resolved Reply
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
            {selectedPatientChannel && (
              <form
                onSubmit={handleSendMessageToPatient}
                className="p-4 border-t border-gray-150 bg-white flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Type your message to patient here..."
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
