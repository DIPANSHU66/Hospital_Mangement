# 🚀 Production Deployment Guide - Hospital Management System

This guide outlines the exact, simple steps to deploy your Hospital Management System to production using **Render** (for the Backend Node/Express API) and **Vercel** (for the Frontend React/Vite SPA).

---

## 📦 Step 1: Deploy Backend to Render

[Render](https://render.com/) is a cloud hosting platform that offers free hosting for Node.js web services.

1. **Sign Up / Log In** to [Render](https://render.com/).
2. Click **New +** ➜ **Web Service**.
3. Connect your GitHub repository (`DIPANSHU66/Hospital_Mangement`).
4. Configure the following fields in the creation wizard:
   * **Name:** `dipanshu-medical-backend`
   * **Root Directory:** `backend`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
5. Click **Advanced** and add the following **Environment Variables**:
   * `PORT` = `8000` (or leave empty, Render assigns automatically)
   * `MONGO_URI` = `mongodb+srv://...` (your MongoDB connection string)
   * `JWT_SECRET_KEY` = `your_jwt_secret_key`
   * `JWT_EXPIRES` = `7d`
   * `COOKIE_EXPIRE` = `7`
   * `CLOUDINARY_CLOUD_NAME` = `your_cloudinary_cloud_name`
   * `CLOUDINARY_API_KEY` = `your_cloudinary_api_key`
   * `CLOUDINARY_API_SECRET` = `your_cloudinary_api_secret`
   * `FRONTEND_URL` = `https://your-frontend-vercel-link.vercel.app` (you will update this once you deploy the frontend)
6. Click **Deploy Web Service**. Render will build and host your backend API. Copy your backend live URL (e.g. `https://dipanshu-medical-backend.onrender.com`).

---

## 🎨 Step 2: Deploy Frontend to Vercel

[Vercel](https://vercel.com/) is the premier platform for hosting React and Vite applications.

1. **Sign Up / Log In** to [Vercel](https://vercel.com/).
2. Click **Add New** ➜ **Project**.
3. Import your GitHub repository (`DIPANSHU66/Hospital_Mangement`).
4. Configure the following fields:
   * **Framework Preset:** `Vite`
   * **Root Directory:** `frontend`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Expand the **Environment Variables** section and add:
   * `VITE_API_URL` = `https://dipanshu-medical-backend.onrender.com/api/v1` (paste your Render backend URL here, with `/api/v1` appended)
6. Click **Deploy**. Vercel will build and deploy your frontend in under 30 seconds.
7. Copy the Vercel URL (e.g. `https://dipanshu-medical-hms.vercel.app`).

---

## 🔗 Step 3: Link Backend to Frontend (CORS)

Once Vercel gives you your frontend domain (e.g., `https://dipanshu-medical-hms.vercel.app`):
1. Go back to your **Render Dashboard** ➜ **Web Service Settings**.
2. Update the environment variable `FRONTEND_URL` to match your Vercel domain.
3. Save changes. Render will automatically re-deploy, and your secure, cookie-based authentication will work across domains!
