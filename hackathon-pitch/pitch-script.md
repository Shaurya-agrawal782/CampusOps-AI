# CampusOps AI — 3-Minute Pitch Script

---

## ⏱ Timing Guide
| Section | Time |
|---|---|
| Problem | 0:00 – 0:35 |
| Solution | 0:35 – 1:10 |
| Gemini API | 1:10 – 1:40 |
| Live Demo | 1:40 – 2:20 |
| Impact | 2:20 – 2:45 |
| Closing | 2:45 – 3:00 |

---

## 🎤 Script

### [0:00 — PROBLEM]

"Every day on a college campus, thousands of small problems go unresolved.
A student in Hostel B types in WhatsApp: *'2 din se paani nahi aa raha'* —
but no one knows which office to route it to.
Another student needs a bonafide certificate for a scholarship —
she spends 3 days figuring out the right format, the right recipient, the right office.
And the campus admin? He's looking at a spreadsheet from last week, 
with no real-time visibility into what's broken right now.

Campus support is fragmented. It wastes student time. And it wastes admin attention."

---

### [0:35 — SOLUTION]

"We built **CampusOps AI** — an AI-powered campus operations copilot.

CampusOps AI is not just a complaint portal.
It's not a chatbot.
It turns a messy student problem — written in Hindi, English, or Hinglish —
into a **structured, routed, tracked campus action**.

Three things it does:
- **Issue Triage**: A student types their problem. Gemini classifies it, assigns priority, routes it to the right campus unit, and generates a ticket — in under 2 seconds.
- **Application Co-pilot**: A student says 'I need a bonafide certificate for my scholarship.' Gemini writes the full formal application, lists missing details, and suggests attachments.
- **Admin Command Center**: Admins get a real-time dashboard with AI situation summaries, priority charts, campus hotspots, and a routed ticket table — all in one place."

---

### [1:10 — GEMINI API]

"We use the **Gemini 1.5 Flash API** at the core of everything.

For issue triage, we send the raw student input to Gemini with a structured prompt.
Gemini returns a clean JSON object — category, priority, campus unit, issue type, sentiment, summary, suggested action, and a student-facing message.

For the application generator, Gemini receives the student's simple request —
even in Hinglish — and returns a fully formatted formal application with subject line, body, salutation, and closing.

For the admin summary, Gemini reads the last 50 active tickets and generates a 3-sentence campus situation briefing.

All API keys stay server-side. Students never touch the API."

---

### [1:40 — LIVE DEMO]

"Let me quickly show you this live.

[Open triage page]
A student types: *'Hostel B me 2 din se paani nahi aa raha'*
One click — and watch Gemini classify it: Category Hostel, Priority High, Campus Unit: Hostel Warden. Ticket created with ID and status timeline.

[Open application generator]
Same student says: 'I need a bonafide certificate for scholarship.'
Gemini drafts the full formal application — with subject, recipient, body, and even lists what's missing.

[Open admin dashboard]
The admin sees an AI-written campus briefing, a live chart of campus unit workload, the hostel water issue appearing in the urgent panel, and a one-click status update to mark it In Progress."

---

### [2:20 — IMPACT]

"The impact is real:
- Students spend **30 seconds** instead of 3 days on formal applications.
- Campus issues get **routed instantly** to the right unit instead of being lost in WhatsApp groups.
- Admins get **one unified view** instead of scattered emails and spreadsheets.
- Hindi and Hinglish are fully supported — no student is left behind because of language.

This works for a hostel with 500 students.
It works for a campus with 10,000."

---

### [2:45 — CLOSING]

"CampusOps AI is a complete, working, hackathon-built system —
with a Gemini-powered AI brain, a real MERN stack backend, a fully seeded demo dataset,
and a judge-ready admin command center.

We didn't build a prototype.
We built the product.

Thank you."

---

> 💡 **Speaker tip**: Maintain eye contact during the problem section. Demo should be pre-loaded and rehearsed. Speak at 150 words/minute for 3 minutes.
