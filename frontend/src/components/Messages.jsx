import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaInbox, FaSearch, FaFilter, FaReply, FaClock, FaSpinner } from "react-icons/fa";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All"); // 'All', 'Replied', 'Pending'

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/message/getall`,
        { withCredentials: true }
      );

      const messageList = res.data.messages || [];

      // Enrich messages with sender user details
      const enrichedMessages = await Promise.all(
        messageList.map(async (msg) => {
          try {
            const userRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/user/getdetail/${msg.sender}`,
              { withCredentials: true }
            );
            return { ...msg, senderDetails: userRes.data.user };
          } catch {
            return {
              ...msg,
              senderDetails: { firstname: "Unknown", lastname: "", role: "N/A" }
            };
          }
        })
      );

      setMessages(enrichedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (e, messageId) => {
    e.stopPropagation(); // Stop click bubbling to Link
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/message/deletemessage`, {
        data: { id: messageId },
        withCredentials: true,
      });

      toast.success("Message deleted");
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  // Filter logic
  const filteredMessages = messages.filter((msg) => {
    const senderName = `${msg.firstname} ${msg.lastname}`.toLowerCase();
    const messageContent = (msg.message || "").toLowerCase();
    const matchesSearch = senderName.includes(searchQuery.toLowerCase()) || messageContent.includes(searchQuery.toLowerCase());

    if (filterType === "All") return matchesSearch;
    if (filterType === "Replied") return matchesSearch && msg.isReplied;
    return matchesSearch && !msg.isReplied;
  });

  return (
    <section className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto mt-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-950 flex items-center gap-3">
              <FaInbox className="text-indigo-600" />
              Patient Inquiries
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Read and reply to direct helpdesk questions submitted by registered patients.
            </p>
          </div>

          {/* Counts */}
          <div className="flex gap-4 text-xs font-bold text-gray-500 bg-white border border-gray-150 p-3 rounded-2xl shadow-sm">
            <div>
              <span>Total: </span>
              <span className="text-gray-900">{messages.length}</span>
            </div>
            <div className="border-r border-gray-200"></div>
            <div>
              <span>Pending: </span>
              <span className="text-amber-600">{messages.filter(m => !m.isReplied).length}</span>
            </div>
            <div className="border-r border-gray-200"></div>
            <div>
              <span>Replied: </span>
              <span className="text-green-600">{messages.filter(m => m.isReplied).length}</span>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-gray-150 p-4 rounded-2xl shadow-sm mb-6">
          <div className="relative w-full sm:max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["All", "Pending Reply", "Replied"].map((type) => {
              const val = type === "Pending Reply" ? "Pending" : type;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(val)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                    (filterType === val) || (filterType === "Pending" && val === "Pending")
                      ? "bg-indigo-55 text-indigo-700 border-indigo-200"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Listing */}
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
            <span className="text-gray-500">Loading inquiries...</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <FaInbox className="text-gray-300 text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No Inquiries Found</h3>
            <p className="text-gray-550 text-sm mt-1">
              You've cleared all inbox entries for the selected filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMessages.map((msg) => {
              const senderName = `${msg.senderDetails?.firstname || "Unknown"} ${msg.senderDetails?.lastname || ""}`;
              return (
                <div key={msg._id} className="relative group">
                  <Link
                    to={`/message/${msg.sender}`}
                    state={{ name: senderName, role: msg.senderDetails?.role }}
                    className="block h-full"
                  >
                    <div className="bg-white border border-gray-150 rounded-2xl p-6 hover:shadow-md transition duration-300 h-full flex flex-col justify-between border-b-4 hover:border-b-indigo-500 border-b-transparent">
                      <div className="space-y-4">
                        {/* Status tag */}
                        <div className="flex justify-between items-center">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                              ${
                                msg.isReplied
                                  ? "bg-green-50 text-green-700 border border-green-150"
                                  : "bg-amber-50 text-amber-700 border border-amber-150"
                              }
                            `}
                          >
                            {msg.isReplied ? "Replied" : "Pending Reply"}
                          </span>
                          <button
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"
                            onClick={(e) => handleDelete(e, msg._id)}
                            title="Delete inquiry"
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>

                        {/* Patient info */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {msg.firstname} {msg.lastname}
                          </h3>
                          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                            <FaClock />
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {/* Message Preview */}
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                          <p className="text-sm text-gray-650 italic line-clamp-3">
                            "{msg.message}"
                          </p>
                        </div>
                      </div>

                      {/* Action trigger */}
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                        <span className="flex items-center gap-1.5 hover:underline">
                          <FaReply />
                          {msg.isReplied ? "View conversation" : "Reply to inquiry"}
                        </span>
                        <span className="text-gray-400 font-medium font-sans">
                          {msg.email}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Messages;
