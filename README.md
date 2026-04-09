# 📋 JobTracker — Intelligent Career Dashboard

JobTracker is a premium, minimal MERN-stack application designed to streamline the job search process using AI-powered automation and high-fidelity analytics.

![JobTracker Landing](https://via.placeholder.com/1200x600/FAFAFA/09090b?text=Premium+Minimal+Design)

## ✨ Core Features

### 🛠️ Strategic Kanban Board
Manage your application lifecycle with an intuitive drag-and-drop interface.
- 5 Structured stages: Applied, Phone Screen, Interview, Offer, Rejected.
- Fast status transitions with real-time database synchronization.
- Minimal, distraction-free cards focused on key contact and metadata.

### 🤖 AI-Powered Parsing
Turn messy job descriptions into actionable data instantly.
- **Smart Extraction**: Extracts Company, Role, Location, and Skills.
- **Resume Suggestions**: Generates 3-5 high-impact bullet points tailored specifically to the job role.
- **Resilient AI**: Automatic switch from OpenAI to Groq for maximum uptime.

### 📊 Advanced Insights
Data-driven search strategy.
- **Conversion Funnel**: Visualize where you are succeeding.
- **Skill Demand Map**: See which skills are most requested in your job market.

---

## 🔒 Security & Resilience
- **Failover Architecture**: Automatic switch between AI providers to ensure uptime.
- **Brute-Force Protection**: Rate limiting on Auth endpoints (15 attempts/hour).
- **Cost Protection**: AI endpoints limited (30 requests/hour) to prevent API usage spikes.
- **Header Security**: Implementation of **Helmet.js** to secure against common web vulnerabilities.
- **Parameter Sanity**: Protection against HTTP Parameter Pollution (HPP).

---

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, TanStack Query.
- **Backend**: Node.js, Express, TypeScript, express-rate-limit, helmet.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT Authentication, Bcrypt password hashing.

---

## 🚀 Roadmap (Future Features)

- [ ] **Unified Profile**: Upload a base resume for the AI to perform direct "Resume-to-Job" gap analysis.
- [ ] **Email Integration**: Auto-link follow-up reminders based on application dates.

---

## 🛠️ Quick Start

Check the [DEPLOY.md](DEPLOY.md) for production instructions.

```bash
# Start Backend
cd server && npm run dev

# Start Frontend
cd client && npm run dev
```

---

## 🎓 Master Documentation
For a deep dive into every architectural decision, security layer, and AI integration, review the **[MASTER_GUIDE.md](MASTER_GUIDE.md)**.

