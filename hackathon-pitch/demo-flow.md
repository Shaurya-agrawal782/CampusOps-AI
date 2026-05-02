# CampusOps AI — Live Demo Flow

> **Setup**: Have two browser tabs open — one as Student, one as Admin. Backend running on port 5000. Frontend on port 5173.

---

## ✅ Pre-Demo Checklist

- [ ] Backend running: `node index.js` in `/server`
- [ ] Frontend running: `npm run dev` in `/client`
- [ ] Logged in as **student**: `student@campusops.ai` / `Student@123`
- [ ] Admin tab open: `admin@campusops.ai` / `Admin@123`
- [ ] Demo Mode visible on admin dashboard (or seeded data loaded)
- [ ] Browser zoom at 90% for best layout
- [ ] Dark mode preferred for premium look

---

## 🎬 Demo 1 — Student Issue Triage (45 seconds)

### Goal: Show AI-powered multilingual issue classification and ticket creation.

### Steps:

**1.** Navigate to: `http://localhost:5173/triage`
> Show the clean input page — "Report a Campus Issue"

**2.** Click the quick example button:
> `"Hostel B me 2 din se paani nahi aa raha"`
> *(This fills the textarea automatically)*

**3.** Click **"Analyze & Create Ticket"**

**4.** While loading, narrate:
> *"Gemini is now receiving this Hinglish input and returning a structured classification..."*

**5.** Show the AI Classification card:
| Field | Expected Value |
|---|---|
| Category | Hostel |
| Priority | 🔴 High |
| Campus Unit | Hostel Warden / Hostel Maintenance |
| Issue Type | Issue |
| Sentiment | 😤 Frustrated |
| Detected Language | Hinglish |
| Confidence | 91% |

**6.** Point out the **Suggested Action** and **Student Message** fields.

**7.** Show the **Ticket Confirmation** card:
- Ticket ID (e.g. `CAMP-2026-1001`)
- Status: Pending Review
- Campus Unit routed to
- Status Timeline: Submitted ✓ → AI Routed ✓ → Campus Unit Review ⏳

**8.** Say:
> *"In under 2 seconds — a messy Hinglish complaint became a structured, routed, trackable campus ticket."*

---

## 🎬 Demo 2 — Application Co-pilot (40 seconds)

### Goal: Show Gemini generating a formal application from a plain student request.

### Steps:

**1.** Navigate to: `http://localhost:5173/copilot`
> Show the two-column layout — "AI Request Co-pilot"

**2.** Click the quick example:
> `"I need a bonafide certificate for scholarship submission."`

**3.** Select request type: **Bonafide Certificate Request**
> (Recipient auto-fills: *The Registrar / Student Welfare Office*)

**4.** Fill fields:
- Student Name: `Shaurya Agrawal`
- Roll No: `12345`
- Department: `B.Tech CSE`

**5.** Click **"Generate Formal Application"**

**6.** Show the result panel:
- **Application Title**: Bonafide Certificate Request
- **Subject**: Formal subject line auto-generated
- **Recipient**: Auto-filled correctly
- **Formal Application**: Full letter with date, salutation, body, signature
- **Missing Details**: Scholarship name, deadline (Gemini flagged these)
- **Suggested Attachments**: Student ID, Scholarship form
- **Next Step**: Submit to Student Welfare Office

**7.** Click **Copy** → show clipboard confirmation ✓

**8.** Click **Download** → `.txt` file downloads

**9.** Say:
> *"A student who would have spent 3 days writing this — did it in 3 seconds."*

---

## 🎬 Demo 3 — Admin Command Center (35 seconds)

### Goal: Show admin getting real-time campus intelligence.

### Steps:

**1.** Switch to the Admin tab: `http://localhost:5173/admin`

**2.** Point to the **Demo Mode badge** (if visible):
> *"This shows seeded campus data — 10 realistic issues across all categories."*

**3.** Show the **Summary Cards**:
- Total Issues: 10
- Pending Review: 3
- High Priority: 4
- Resolved: 1

**4.** Show the **AI Campus Situation Summary** card:
> *"Gemini reads all active tickets and writes this 3-sentence briefing in real time."*
> Read one sentence from the summary aloud.

**5.** Show the **Campus Unit Workload** bar chart.

**6.** Show the **Priority Distribution** donut chart.

**7.** Show the **Urgent Attention Panel**:
- Canteen emergency — Critical
- Streetlight — Critical (escalated)
- Click **Review Now** on one ticket

**8.** Show the **Campus Hotspot Areas** grid — 6 areas with issue counts.

**9.** Show the **Recent Routed Tickets** table:
- Point to inline status dropdown
- Change one ticket from `In Review` to `In Progress`
- Show it updates instantly

**10.** Say:
> *"This is what a campus admin sees every morning — instead of emails and WhatsApp messages."*

---

## 🔄 Demo Reset (if needed)

```bash
# Re-seed demo data
cd server
node seedCampusData.js
```

---

## ⚠️ Fallback Plan

If internet/Gemini API fails:
- Demo samples use **cached results** (no API call needed)
- Admin dashboard **auto-shows demo data** when DB is empty
- Application generator **falls back to cached output**

> All three demos work fully offline with cached/seeded data.
