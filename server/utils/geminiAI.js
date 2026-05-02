const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * CampusOps AI — Campus Issue Analyzer
 * Uses Gemini to classify student campus issues/requests into structured JSON.
 */
async function analyzeGrievance(title, description, images = []) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY missing. Using campus keyword fallback.");
    return fallbackAnalysis(title, description);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const contents = [];

    const prompt = `
You are CampusOps AI, an intelligent assistant for a smart campus management system.
A student has submitted the following issue or request. It may be written in English, Hindi, or Hinglish.

Title: "${title}"
Description: "${description}"

CAMPUS CATEGORIES (pick the single best match):
Hostel, Canteen, Library, Lab / IT, Classroom, Transport, Exam Cell,
Accounts / Fees, Maintenance, Security, Sports, Administration, Medical Room,
Scholarship Cell, Other

CAMPUS UNIT MAPPING:
- Hostel → Hostel Warden / Hostel Maintenance
- Canteen → Canteen Committee / Food Services
- Library → Library Office
- Lab / IT → IT Support / Lab Assistant
- Classroom → Academic Block Maintenance
- Transport → Transport Office
- Exam Cell → Examination Cell
- Accounts / Fees → Accounts Department
- Maintenance → Campus Maintenance Team
- Security → Campus Security Office
- Sports → Sports Department
- Administration → Administrative Office
- Medical Room → Campus Medical Room
- Scholarship Cell → Scholarship / Student Welfare Office
- Other → Student Support Desk

RULES:
1. Return ONLY valid JSON — no markdown, no explanation, no code fences.
2. Detect the language (English / Hindi / Hinglish / Other).
3. If the issue involves danger, fire, harassment, violence, or medical emergency → priority = "critical", campusUnit = "Campus Security Office" or "Campus Medical Room" as appropriate.
4. If the student is requesting a certificate, permission, leave, fee extension, scholarship, or exam correction → issueType = "Request".
5. If input is unclear or very short → category = "Other", and ask for more details in studentMessage.
6. priority must be one of: "low", "medium", "high", "critical".
7. sentiment must be one of: "Calm", "Confused", "Frustrated", "Angry", "Worried".
8. issueType must be one of: "Issue", "Request", "Emergency", "Information".

Return exactly this JSON structure:
{
  "category": "<one of the 15 campus categories>",
  "priority": "low | medium | high | critical",
  "campusUnit": "<mapped campus unit name>",
  "sentiment": "Calm | Confused | Frustrated | Angry | Worried",
  "issueType": "Issue | Request | Emergency | Information",
  "summary": "<1-2 line English summary of the student problem>",
  "suggestedAction": "<clear next action for campus staff>",
  "studentMessage": "<friendly message in English for the student>",
  "requiresAdminReview": true | false,
  "confidence": <0-100>,
  "detectedLanguage": "English | Hindi | Hinglish | Other",
  "translatedDescription": "<English translation if not already English, else same as description>",
  "isUrgent": true | false
}
`;

    contents.push({ text: prompt });

    // Add images if provided (vision support)
    for (const img of images) {
      if (img.inlineData) {
        contents.push({ inlineData: img.inlineData });
      }
    }

    const result = await model.generateContent(contents);
    const response = await result.response;
    const text = response.text();

    // Strip any accidental markdown fences
    const jsonStr = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    // Ensure backward-compat field used by older frontend paths
    parsed.suggestedDepartment = parsed.campusUnit;
    parsed.sentiment = parsed.sentiment || 'Calm';

    return parsed;

  } catch (error) {
    console.error("Gemini Analysis Error:", error.message);
    return fallbackAnalysis(title, description);
  }
}

/**
 * Campus keyword-based fallback when Gemini API is unavailable
 */
function fallbackAnalysis(title, description) {
  const { classifyCampusIssue } = require('./aiClassifier');
  const result = classifyCampusIssue(title, description);

  return {
    category: result.category,
    priority: result.priority,
    campusUnit: result.campusUnit,
    suggestedDepartment: result.campusUnit,   // backward compat
    sentiment: result.sentiment,
    issueType: result.issueType,
    summary: result.summary,
    suggestedAction: result.suggestedAction,
    studentMessage: result.studentMessage,
    requiresAdminReview: result.priority === 'high' || result.priority === 'critical',
    confidence: result.confidence,
    detectedLanguage: 'English',
    translatedDescription: description,
    isUrgent: result.priority === 'high' || result.priority === 'critical',
    alternatives: result.alternatives || []
  };
}

/**
 * Generate a professional draft response for a campus admin
 */
async function generateOfficialResponse(grievance, context) {
  if (!process.env.GEMINI_API_KEY) {
    return "Thank you for reaching out. We have received your request and our team is looking into it. We will update you shortly.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are a campus administrative assistant helping a staff member respond to a student issue.

Issue Title: "${grievance.title}"
Description: "${grievance.description}"
Current Status: "${grievance.status}"
Campus Unit: "${grievance.aiClassification?.campusUnit || grievance.department || 'Campus Support'}"
Staff Note/Context: "${context || ''}"

Write a short, professional, and empathetic response to send to the student. It should:
1. Acknowledge their issue.
2. State what action is being taken (based on the staff note/context).
3. Provide a polite, reassuring closing.

Return ONLY the response text — no subject line, no labels.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Response Generation Error:", error.message);
    return "We have received your request and our campus team is working on a resolution. We appreciate your patience.";
  }
}

module.exports = { analyzeGrievance, generateOfficialResponse };
