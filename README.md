# Dipanshu Medical Institute - MERN Hospital Management System (HMS)

An enterprise-grade, highly secure, and responsive **Hospital Management System (HMS)** built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). This project showcases clean software engineering practices, Role-Based Access Control (RBAC), secure JWT/cookie-based session state, optimized database indexes, and an AI Chatbot Assistant with smart offline fallback mechanisms.

---

## 🌟 Core Architecture & Technical Highlights

*   **Role-Based Access Control (RBAC):** Restricts interface layout and endpoint visibility between three system roles:
    *   **Patient:** Can book appointments (auto-filled forms), check appointment status timelines, and access a support desk chat threads with Admins.
    *   **Doctor:** Can view assigned appointments in a fluid grid, filter/search by patient, review details, change appointment statuses (Pending, Accepted, Rejected), and view metrics.
    *   **Admin:** Full dashboard control to register new doctors, read and delete inquiries, check response status indicators (`Replied` or `Pending Reply`), and reply directly to patients.
*   **Centralized Middleware Validation & Security:**
    *   Centralized global error middleware handling duplicate MongoDB key entry, Mongoose validator schemas, JWT expiry, and route casting failures.
    *   Authentication guards (`isAuthenticated`) verifying HTTP-Only cookies containing sign-validated JWT payload claims.
*   **Database Query Optimization:**
    *   Includes compound indexes on `AppointmentSchema.js` targeting `{ patientId: 1, appointment_date: -1 }` and `{ doctor_id: 1, appointment_date: -1 }` to optimize large queries.
    *   Single-field index on user `email` for rapid authentication and user queries.
*   **Generative AI Assistant:**
    *   Powered by Google Gemini (Generative Language REST API) with structured instruction parameters.
    *   Incorporates a local, keyword-matching fallback system to service inquiries when API keys are not supplied.

---

## 📡 REST API Documentation

Detailed RESTful endpoints conforming to standard HTTP verbs and response models:

### 🔑 Authentication & Profiles (`/api/v1/user`)
| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | Public | Register a Patient account. |
| `/login` | `POST` | Public | Authenticated login setting HTTP-Only Cookie. |
| `/logout` | `GET` | Authenticated | Clears cookies and destroys auth state. |
| `/me` | `GET` | Authenticated | Retrieve current user profile state. |
| `/doctors` | `GET` | Authenticated | Fetch list of all registered doctors. |
| `/getdetail/:id` | `GET` | Authenticated | Retrieve user profile by MongoDB ObjectId. |
| `/admin/addnew` | `POST` | Public | Register a new Administrator account. |
| `/doctor/addnew` | `POST` | Admin Only | Register a doctor with avatar upload (Multer/Cloudinary). |

### 📅 Appointment Services (`/api/v1/appointment`)
| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/post` | `POST` | Patient Only | Books an appointment (pre-filled validator). |
| `/appointmentget` | `GET` | Patient/Doctor | Fetch relevant appointments. |
| `/update/:id` | `PUT` | Doctor Only | Update appointment status. |
| `/delete/:id` | `DELETE` | Authenticated | Remove/cancel an appointment. |

### 💬 Helpdesk & Messages (`/api/v1/message`)
| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/send/:id?` | `POST` | Authenticated | Send message. Auto-populates data from user. |
| `/getall` | `GET` | Authenticated | Fetch messages (Admins get incoming; Patients get their thread). |
| `/reply/:id` | `PUT` | Admin Only | Update an inquiry with an Admin response. |
| `/deletemessage` | `DELETE` | Admin Only | Remove message record. |

### 🤖 Chatbot Services (`/api/v1/chatbot`)
| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/ask` | `POST` | Public | Send messages to AI chatbot. |

---

## 📂 Codebase Structure

```
Hospital Manage/
├── backend/
│   ├── Controllers/         # MVC Controllers for route logic
│   ├── database/            # Mongoose DB connection setup
│   ├── middleware/          # Auth, error, and file-upload middlewares
│   ├── models/              # Schema declarations (User, Appointment, Message)
│   ├── router/              # Router mapping
│   ├── utils/               # Helper utilities (Cloudinary, Data URI)
│   └── index.js             # Express Entry file
└── frontend/
    ├── src/
    │   ├── components/      # UI Components (Home, Profile, Helpdesk, Form, Chat)
    │   ├── redux/           # Global state storage (Auth, Doctor lists)
    │   ├── App.jsx          # Route declarations
    │   ├── main.jsx         # Vite entry
    │   └── index.css        # Tailwind initialization
    └── package.json         # Package configuration
```

---

## ⚙️ Local Setup Guide

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Atlas or Local)
*   Cloudinary Account (for Doctor profile image assets)

### 2. Backend Config
1.  Navigate to `/backend`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file containing:
    ```env
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    FRONTEND_URL=http://localhost:5173
    JWT_SECRET_KEY=any_secure_signing_salt
    CLOUD_NAME=your_cloudinary_name
    API_KEY=your_cloudinary_api_key
    API_SECRET=your_cloudinary_api_secret
    GEMINI_API_KEY=your_optional_google_gemini_key (Leave empty for fallback)
    ```
4.  Run in dev mode:
    ```bash
    npm run dev
    ```

### 3. Frontend Config
1.  Navigate to `/frontend`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file containing:
    ```env
    VITE_API_URL=http://localhost:8000/api/v1
    ```
4.  Run in dev mode:
    ```bash
    npm run dev
    ```
5.  Access the web interface at `http://localhost:5173`.
