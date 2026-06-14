import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaComments, FaTimes, FaPaperPlane, FaUserMd, FaRobot } from "react-icons/fa";

const PRESET_QUESTIONS = [
  "How do I book an appointment?",
  "What departments do you have?",
  "How can I contact the hospital?",
  "What roles are in the system?"
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Hello! Welcome to Dipanshu Medical Institute. I am your AI assistant. How can I assist you today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const trimmedText = textToSend ? textToSend.trim() : message.trim();
    if (!trimmedText) return;

    if (!textToSend) {
      setMessage("");
    }

    // Add user message to history
    setChatHistory((prev) => [...prev, { sender: "user", text: trimmedText }]);
    setIsTyping(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chatbot/ask`,
        { message: trimmedText },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply }
      ]);
    } catch (err) {
      console.error("Chatbot response error:", err);
      // Client-side fallback just in case the backend fails or API key triggers error
      const errorMsg = err.response?.data?.message || "";
      let fallbackReply = "I'm sorry, I encountered a temporary connection issue. Please make sure the backend server is running.";
      
      if (errorMsg.includes("key is missing") || err.response?.status === 503) {
        fallbackReply = "Hello! I am operating in local help mode. To book an appointment, register as a Patient, select 'Appointments' from the nav bar, and submit the booking form. To contact us, check our footer info!";
      }

      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: fallbackReply }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePresetClick = (question) => {
    handleSendMessage(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center animate-bounce hover:animate-none cursor-pointer"
          title="Open Assistant"
        >
          <FaComments className="text-2xl" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border border-gray-200 w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FaUserMd className="text-xl text-cyan-200" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-wide">Dipanshu Medical Bot</h3>
                <span className="text-xs text-green-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  Online Assistant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition duration-200 hover:rotate-90 transform cursor-pointer"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-300 text-indigo-600"
                  }`}
                >
                  {msg.sender === "user" ? "Me" : <FaRobot />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-150 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-300 text-indigo-600 flex items-center justify-center text-xs">
                  <FaRobot />
                </div>
                <div className="bg-white border border-gray-150 text-gray-500 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 border-t border-gray-100 bg-white">
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-1.5">
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-[75px] overflow-y-auto">
              {PRESET_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(q)}
                  className="bg-blue-50 text-blue-700 hover:bg-indigo-100 text-[11px] font-medium px-2.5 py-1 rounded-full border border-blue-200/50 hover:border-indigo-300 transition duration-200 cursor-pointer shadow-sm text-left truncate max-w-[170px]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-gray-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask medical assistant..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl shadow hover:scale-105 active:scale-95 transition flex items-center justify-center cursor-pointer"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
