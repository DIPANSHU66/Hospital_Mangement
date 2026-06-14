const { catchAsyncErrors, ErrorHandler } = require("../middleware/errorMiddleware");
const fetch = require("node-fetch"); // Use native fetch in Node 18+, but node-fetch if older. Actually Node 18+ has native fetch.

const askChatbot = catchAsyncErrors(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ErrorHandler("Please provide a message", 400));
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const query = message.toLowerCase();
    let reply = "Hello! I am the Dipanshu Medical AI Assistant. How can I help you today?";
    
    if (query.includes("appointment") || query.includes("book") || query.includes("schedule")) {
      reply = "To book an appointment, please log in as a Patient, go to the 'Appointments' section in the navigation bar, fill out the form with your details, select a department and doctor, and click 'Book Appointment'.";
    } else if (query.includes("department") || query.includes("specialty") || query.includes("services")) {
      reply = "We offer a wide range of specialized departments including Cardiology, Pediatrics, Orthopedics, Neurology, Dermatology, Oncology, and many more. You can check them out in the 'Our Departments' carousel on the homepage.";
    } else if (query.includes("doctor") || query.includes("physician") || query.includes("staff")) {
      reply = "Our hospital is staffed by highly qualified specialists. You can view the list of available doctors in the 'DoctorsList' section once logged in.";
    } else if (query.includes("contact") || query.includes("phone") || query.includes("email") || query.includes("address")) {
      reply = "You can contact Dipanshu Medical Institute via email at contact@dipanshumedical.com, call us at +1-800-555-0199, or send us a message using the contact form at the bottom of the homepage.";
    } else if (query.includes("admin") || query.includes("register admin")) {
      reply = "Authorized administrators can register via the Admin Register page. Once logged in, admins can register new doctors, view incoming messages, and manage the system.";
    } else if (query.includes("role") || query.includes("rbac") || query.includes("access")) {
      reply = "Our system uses Role-Based Access Control (RBAC). Patients can book and view appointments. Doctors can view and update the status of their appointments. Admins have access to the dashboard to register doctors and read patient inquiries.";
    } else {
      reply = "Hello! I'm currently running in offline medical assistant mode. You can ask me about booking appointments, our medical departments, contacting us, or doctor roles!";
    }
    
    return res.status(200).json({
      success: true,
      reply,
      offline: true
    });
  }

  const systemInstruction = "You are a helpful and polite AI assistant for a Hospital Management System. You help patients with queries about appointments, departments, and general hospital information. Keep your answers concise, empathetic, and professional.";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API Error:", errorData);
      return next(new ErrorHandler("Failed to generate response from Chatbot", 500));
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't understand that.";

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chatbot Error:", error);
    return next(new ErrorHandler("Error communicating with Chatbot service", 500));
  }
});

module.exports = { askChatbot };
