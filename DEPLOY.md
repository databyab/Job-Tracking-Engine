# 🚀 Deployment Guide: JobTracker

Follow these steps in the exact order to ensure a smooth deployment.

## 1. Database Setup (MongoDB Atlas)
Before deploying code, you need a live database.
1.  Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new Cluster (Shared/Free tier is fine).
3.  Go to **Database Access** and create a user with read/write permissions.
4.  Go to **Network Access** and add `0.0.0.0/0` (or specifically the Render/backend IP if preferred).
5.  Go to **Database -> Connect -> Connect your application** and copy the Connection String.
    *   *Example: `mongodb+srv://<user>:<password>@cluster.mongodb.net/jobtracker?retryWrites=true&w=majority`*

---

## 2. Backend Deployment (Render)
Deploy the API server first to get your backend URL.
1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  Set the following configuration:
    *   **Name**: `job-tracker-api`
    *   **Root Directory**: `server`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
4.  Add the **Environment Variables**:
    *   `MONGO_URI`: (Your connection string from Step 1)
    *   `JWT_SECRET`: (Generate a long random string)
    *   `OPENAI_API_KEY`: (Your OpenAI key)
    *   `GROQ_API_KEY`: (Your Groq key)
    *   `NODE_ENV`: `production`
    *   `CLIENT_URL`: (You will update this later with the frontend URL)
5.  Wait for the deployment to finish and copy the Backend URL (e.g., `https://job-tracker-api.onrender.com`).

---

## 3. Frontend Configuration
You must point the React app to your new backend.
1.  In your local project, open `client/src/services/api.ts`.
2.  Modify the `API_URL` to support an environment variable:
    ```typescript
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    ```
3.  Commit and push this change.

---

## 4. Frontend Deployment (Render / Vercel / Netlify)
Deploy the client-side application.
1.  Create a new **Static Site** (Render) or **Project** (Vercel/Netlify).
2.  Set the following configuration:
    *   **Root Directory**: `client`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
3.  Add the **Environment Variable**:
    *   `VITE_API_URL`: `https://job-tracker-api.onrender.com/api` (Replace with your actual backend URL)
4.  Once deployed, copy your Frontend URL (e.g., `https://job-tracker.onrender.com`).

---

## 5. Finalize Backend CORS
Secure your API by allowing only your frontend to access it.
1.  Go back to your **Backend Service** on Render.
2.  Update the `CLIENT_URL` environment variable with your Frontend URL.
3.  Render will automatically redeploy the backend with the updated CORS policy.

---

## ✅ Post-Deployment Check
1.  Visit your frontend URL.
2.  Check the "Register" or "Login" flow.
3.  Verify AI features by parsing a job description.
4.  Monitor logs in the Render dashboard for any errors.
