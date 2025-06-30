import React, { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/message/getall",
        {
          withCredentials: true,
        }
      );

      const messageList = res.data.messages;

      const enrichedMessages = await Promise.all(
        messageList.map(async (msg) => {
          try {
            const userRes = await axios.get(
              `http://localhost:8000/api/v1/user/getdetail/${msg.sender}`,
              { withCredentials: true }
            );

            return { ...msg, senderDetails: userRes.data.user };
          } catch {
            return {
              ...msg,
              senderDetails: { firstname: "Unknown", role: "N/A" },
            };
          }
        })
      );

      setMessages(enrichedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (messageId) => {
    try {
      await axios.delete("http://localhost:8000/api/v1/message/deletemessage", {
        data: { id: messageId },
        withCredentials: true,
      });

      toast.success("Message deleted");
      setMessages(messages.filter((msg) => msg._id !== messageId));
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  return (
    <section className="w-full min-h-screen py-20 bg-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full px-4">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
          All Messages
        </h2>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No messages found.
          </div>
        ) : (
          <Carousel
            responsive={responsive}
            infinite
            autoPlay
            autoPlaySpeed={3000}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            itemClass="px-3 flex justify-center"
          >
            {messages.map((msg) => {
              const senderName = `${
                msg.senderDetails?.firstname || "Unknown"
              } ${msg.senderDetails?.lastname || ""}`;
              const senderRole = msg.senderDetails?.role || "N/A";

              return (
                <div key={msg._id} className="relative w-full max-w-sm">
                  <Link
                    to={`/message/${msg.sender}`}
                    state={{ name: senderName, role: senderRole }}
                    className="block"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition duration-300 p-6 text-left cursor-pointer">
                      <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                        {msg.firstname} {msg.lastname}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {msg.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Phone:</strong> {msg.phone}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 mb-2">
                        <strong>Message:</strong>
                        <br />"{msg.message}"
                      </p>
                      <p className="text-xs text-gray-400">
                        Sent on: {new Date(msg.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 italic">
                        Sender: {senderName} ({senderRole})
                      </p>
                    </div>
                  </Link>

                  <button
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(msg._id)}
                    title="Delete Message"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              );
            })}
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default Messages;
