import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUserCircle, FaReply, FaClock, FaCheck, FaExclamationCircle, FaSpinner } from "react-icons/fa";

const MessageDetail = () => {
  const { id } = useParams(); // This is the patient ID
  const location = useLocation();

  const receiverName = location.state?.name || "Patient";
  const receiverRole = location.state?.role || "Patient";

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyTextMap, setReplyTextMap] = useState({}); // Stores reply text keyed by message ID
  const [submittingMap, setSubmittingMap] = useState({}); // Stores sending state keyed by message ID

  const fetchPatientThread = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/message/getall`,
        { withCredentials: true }
      );
      
      const allMsgs = res.data.messages || [];
      // Filter messages where sender is this specific patient
      const patientThread = allMsgs.filter((msg) => msg.sender === id);
      
      setMessages(patientThread);
    } catch (error) {
      console.error("Error fetching message thread:", error);
      toast.error("Failed to load conversation history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientThread();
  }, [id]);

  const handleReplyChange = (msgId, val) => {
    setReplyTextMap((prev) => ({ ...prev, [msgId]: val }));
  };

  const handleSendReply = async (msgId) => {
    const text = replyTextMap[msgId]?.trim();
    if (!text) {
      toast.warning("Please type a response first.");
      return;
    }

    setSubmittingMap((prev) => ({ ...prev, [msgId]: true }));
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/message/reply/${msgId}`,
        { reply: text },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Reply sent successfully!");
      // Clear input
      handleReplyChange(msgId, "");
      // Refresh thread
      fetchPatientThread();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit reply.");
    } finally {
      setSubmittingMap((prev) => ({ ...prev, [msgId]: false }));
    }
  };

  return (
    <section className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto mt-6">
        <div className="mb-6">
          <Link
            to="/admin/messages"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-650 hover:text-indigo-850 hover:underline"
          >
            &larr; Back to Inquiries
          </Link>
        </div>

        {/* Header Summary */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm flex items-center gap-6 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-sm flex-shrink-0">
            {receiverName[0]?.toUpperCase() || "P"}
          </div>
          <div>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              {receiverRole} Thread
            </span>
            <h1 className="text-2xl font-extrabold text-gray-950 mt-1.5">
              {receiverName}
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-sans">
              All messages received from this account and their reply status.
            </p>
          </div>
        </div>

        {/* Thread History */}
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
            <span className="text-gray-500">Loading conversation thread...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
            <FaExclamationCircle className="text-gray-300 text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No Messages Found</h3>
            <p className="text-gray-500 text-sm mt-1">
              There are no messages associated with this user ID.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div
                key={msg._id}
                className="bg-white border border-gray-150 rounded-3xl shadow-sm p-6 relative overflow-hidden space-y-6"
              >
                {/* Index badge */}
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">
                  Inquiry #{messages.length - index}
                </div>

                {/* Patient message card */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <FaUserCircle className="text-sm text-gray-400" />
                    <span>{receiverName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaClock />
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-gray-800 text-sm leading-relaxed font-medium">
                    {msg.message}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-sans">
                    <span>Email: {msg.email}</span>
                    <span>Phone: {msg.phone}</span>
                  </div>
                </div>

                {/* Reply section */}
                <div className="pt-5 border-t border-gray-100 space-y-4">
                  {msg.isReplied ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                        <FaCheck />
                        <span>Administator Reply</span>
                        <span>•</span>
                        <span>{new Date(msg.repliedAt).toLocaleString()}</span>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-950 p-5 rounded-2xl text-sm leading-relaxed font-semibold">
                        {msg.reply}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                        <FaReply />
                        <span>Draft Admin Response</span>
                      </div>
                      
                      <div className="space-y-3">
                        <textarea
                          rows="4"
                          placeholder="Type your official reply to this patient's inquiry..."
                          value={replyTextMap[msg._id] || ""}
                          onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200 resize-none font-medium text-gray-800"
                          disabled={submittingMap[msg._id]}
                        ></textarea>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSendReply(msg._id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow hover:shadow-indigo-500/15 transition flex items-center gap-1.5 cursor-pointer"
                            disabled={submittingMap[msg._id] || !replyTextMap[msg._id]?.trim()}
                          >
                            {submittingMap[msg._id] ? (
                              <>
                                <FaSpinner className="animate-spin text-xs" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <FaReply />
                                <span>Send Reply</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MessageDetail;
