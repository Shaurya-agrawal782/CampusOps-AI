# CampusOps AI

> **AI-powered campus operations copilot for student issues, formal requests, routing, and admin insights.**

[![Built with Gemini](https://img.shields.io/badge/Powered%20by-Gemini%201.5%20Flash-blue)](https://ai.google.dev/)
[![Stack](https://img.shields.io/badge/Stack-MERN-green)](https://www.mongodb.com/)
[![Theme](https://img.shields.io/badge/Theme-Smart%20Campus%20Solution-orange)](/)

---

## 🎯 Problem Statement

Campus support systems are broken:
- Students don't know which office to contact for their issue
- Requests are written informally in Hindi, Hinglish, or English
- Admins have no real-time visibility into campus problems
- Writing formal applications takes students days of effort
- Issues get lost in WhatsApp groups and email chains

---

## 💡 Solution

**CampusOps AI** is a three-part AI-powered system:

| Feature | What It Does |
|---|---|
| **🎯 Issue Triage** | Student types problem in any language → Gemini classifies, prioritizes, routes it to the right campus unit, creates a tracked ticket |
| **📝 Application Co-pilot** | Student describes their request informally → Gemini generates a complete formal campus application |
| **🏛️ Admin Command Center** | Admin sees real-time AI situation summary, charts, urgent tickets, campus hotspots, and inline status management |

---

## ✨ Key Features

### Student Features
- 🗣️ **Multilingual input** — Hindi, English, Hinglish all supported
- ⚡ **AI triage in 1.2 seconds** — no form categories to fill manually
- 🎫 **Instant ticket creation** — with tracking ID and status timeline
- 📄 **Formal application generator** — 10 request types supported
- 📋 **Copy & download** — application as text file
- 🔍 **Real-time ticket tracking** — by tracking ID

### Admin Features
- 🤖 **AI Campus Situation Summary** — Gemini-written briefing from live ticket data
- 📊 **Campus Unit Workload Chart** — bar chart per unit
- 🥧 **Priority Distribution** — donut chart (Low/Medium/High/Critical)
- 📈 **Monthly Trend** — area chart of filed vs resolved
- 🚨 **Urgent Attention Panel** — High/Critical issues with Review Now CTA
- 🗺️ **Campus Hotspot Areas** — 6 locations with issue counts
- 📋 **Routed Tickets Table** — with inline status update dropdown
- 🔴 **Demo Mode** — auto-activates with seeded data when DB is empty

---

## 🤖 Gemini API Usage

| Use Case | Prompt Input | Output |
|---|---|---|
| Issue Classification | Student description (any language) | JSON: category, priority, campus unit, issue type, sentiment, confidence, summary, suggestedAction, studentMessage |
| Priority Detection | Issue context | critical / high / medium / low |
| Multilingual Understanding | Hindi/Hinglish/English | Structured English output |
| Application Generation | Informal request + student details | Complete formal letter + missingDetails + suggestedAttachments + nextStep |
| Admin Situation Summary | Aggregated ticket breakdown | 3-4 sentence natural language briefing |

> **Security**: Gemini API key is server-side only. Frontend never makes direct API calls.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **AI** | Google Gemini 1.5 Flash API |
| **Auth** | JWT (JSON Web Tokens) |
| **Styling** | Vanilla CSS with custom design system |
| **Icons** | Google Material Symbols |

---

## 🎬 Demo Flow

### Demo 1 — Issue Triage
```
Student input: "Hostel B me 2 din se paani nahi aa raha"
  ↓
Gemini classifies: Category=Hostel, Priority=High, Unit=Hostel Warden
  ↓
Ticket created: CAMP-2026-XXXX | Status: Pending Review
  ↓
Status Timeline: Submitted ✓ → AI Routed ✓ → Campus Unit Review ⏳
```

### Demo 2 — Application Generator
```
Student input: "I need a bonafide certificate for scholarship submission."
  ↓
Gemini generates: Complete formal application (English)
  ↓
Shows: Subject, Recipient, Body, Missing Details, Suggested Attachments
  ↓
Student clicks: Copy / Download
```

### Demo 3 — Admin Command Center
```
Admin views: AI situation summary → charts → urgent panel → hotspot areas
Admin action: Inline status update on any ticket
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install

```bash
git clone https://github.com/Shaurya-agrawal782/CampusOps-AI.git
cd CampusOps-AI

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

Create `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/campusops
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### 3. Seed Demo Data

```bash
cd server

# Create admin account
node seedAdmin.js

# Seed 10 campus tickets + student account
node seedCampusData.js
```

**Demo Credentials:**
| Role | Email | Password |
|---|---|---|
| Admin | `admin@campusops.ai` | `Admin@123` |
| Student | `student@campusops.ai` | `Student@123` |

### 4. Run the App

```bash
# Terminal 1 — Backend
cd server && node index.js

# Terminal 2 — Frontend
cd client && npm run dev
```

Open: `http://localhost:5173`

---

## 📁 Project Structure

```
CampusOps AI/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Landing page
│   │   │   ├── IssueTriage.jsx     # Student issue triage
│   │   │   ├── ApplicationCopilot.jsx  # Application generator
│   │   │   ├── AdminDashboard.jsx  # Admin command center
│   │   │   └── CitizenDashboard.jsx  # Student dashboard
│   │   ├── data/
│   │   │   └── demoData.js         # Frontend demo data + cache
│   │   └── services/
│   │       └── api.js              # Axios API service
│   └── ...
├── server/                    # Express backend
│   ├── routes/
│   │   ├── grievances.js       # Ticket CRUD + AI classification
│   │   ├── ai.js               # AI classify endpoint
│   │   ├── applications.js     # Application generation
│   │   └── admin.js            # Admin AI summary
│   ├── utils/
│   │   ├── geminiAI.js         # Gemini API integration
│   │   └── aiClassifier.js     # Keyword fallback classifier
│   ├── seedAdmin.js            # Admin account seed
│   └── seedCampusData.js       # Campus issue seed (10 tickets)
├── hackathon-pitch/           # Presentation materials
│   ├── pitch-script.md
│   ├── demo-flow.md
│   ├── slide-content.md
│   ├── judge-qa.md
│   └── README-hackathon.md
└── README.md
```

---

## 🔮 Future Scope

| Phase | Feature |
|---|---|
| Phase 2 | Voice input, QR-code campus reporting stations |
| Phase 3 | WhatsApp/SMS integration, SLA-based auto-escalation |
| Phase 4 | Campus analytics, trend prediction, predictive maintenance |
| Phase 5 | Multi-campus deployment, per-institution configuration |

---

## 👨‍💻 Built During BGI Hackathon 2026

> *"CampusOps AI turns messy student problems into structured campus actions — tickets, applications, routing, and admin insights. Powered by Gemini."*

---

**© 2026 CampusOps AI — Smart Campus Solution**
