# 💊 Hospital Management App

A full-stack MERN application for seamless hospital operations — enabling user registration, appointment scheduling, and real-time messaging in a modern, responsive interface.

---

## 🛠 Tech Stack

- ⚛️ **React** (with Vite)
- 🧠 **Redux Toolkit** & `redux-persist`
- 🎨 **Tailwind CSS** + `react-icons`
- 🌐 **Express.js** + **Node.js**
- ☁️ **MongoDB Atlas** + **Mongoose**
- 🔐 **JWT Authentication** + **Cookie-Based Auth**
- 📁 **Cloudinary** for image uploads

---

## 🚀 Core Features

- ✅ **User Authentication** with JWT
- 🧾 **Secure Login / Register** with validation
- 📅 **Appointment Booking** system
- 💬 **Real-Time Messaging** (API-based)
- 🗂️ **Clean Folder Structure** (MVC for backend, modular frontend)
- 🧾 **API Logging** with Winston
- 🧼 Fully **mobile-responsive UI**

---

## 🧪 Run Locally

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas URI
- Cloudinary account (for file uploads)

### Clone & Setup

```bash
git clone https://github.com/DIPANSHU66/for-upload.git
cd for-upload

# Install root/backend dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend

# Build the React frontend
npm run build

# Start the fullstack app (both frontend + backend)
npm run dev
