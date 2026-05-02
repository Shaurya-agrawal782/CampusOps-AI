const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { auth } = require('../middleware/auth');

const router = express.Router();

const REQUEST_TYPE_RECIPIENTS = {
  'Leave Application':         'The Head of Department / Class Advisor',
  'Bonafide Certificate Request': 'The Registrar / Student Welfare Office',
  'Fee Extension Request':     'The Accounts Department',
  'Hostel Leave Request':      'The Hostel Warden',
  'Library Fine Issue':        'The Chief Librarian',
  'Scholarship Request':       'The Scholarship / Student Welfare Office',
  'Lab Permission Request':    'The Lab In-Charge / IT Support',
  'Exam Form Correction':      'The Examination Cell',
  'Medical Leave':             'The Campus Medical Room / Class Advisor',
  'Other Campus Request':      'The Administrative Office',
};

// POST /api/applications/generate
router.post('/generate', auth, async (req, res) => {
  const { requestType, studentName, rollNumber, department, recipient, details, dateFrom, dateTo } = req.body;

  if (!requestType || !details) {
    return res.status(400).json({ error: 'Request type and details are required.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json(fallbackGenerate({ requestType, studentName, rollNumber, department, recipient, details, dateFrom, dateTo }));
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const defaultRecipient = REQUEST_TYPE_RECIPIENTS[requestType] || 'The Administrative Office';
    const finalRecipient = recipient || defaultRecipient;

    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const prompt = `
You are an expert academic application writer for a university campus management system called CampusOps AI.

A student has submitted the following request details. Generate a polished, formal campus application.

Request Type: "${requestType}"
Student Name: "${studentName || 'Student'}"
Roll Number / Enrollment: "${rollNumber || 'N/A'}"
Department / Class: "${department || 'N/A'}"
Recipient: "${finalRecipient}"
Date From: "${dateFrom || 'N/A'}"
Date To: "${dateTo || 'N/A'}"
Student's Input (may be in Hindi, English, or Hinglish): "${details}"
Today's Date: "${today}"

Rules:
1. formalApplication must be a complete, professional formal application written in clean, formal English.
2. Include proper salutation, body paragraphs, and a respectful closing with the student's name.
3. If important details are missing (like specific dates, names, reasons), still generate a useful draft and list what's missing in missingDetails.
4. The tone must be formal, respectful, and concise.
5. suggestedAttachments should list relevant documents based on the request type.
6. Return ONLY valid JSON — no markdown, no code fences, no explanation.

Return exactly this JSON structure:
{
  "applicationTitle": "<e.g. Bonafide Certificate Request>",
  "recipient": "<full recipient designation>",
  "subject": "<formal subject line>",
  "formalApplication": "<full formal application text with newlines>",
  "missingDetails": ["<detail 1>", "<detail 2>"],
  "suggestedAttachments": ["<attachment 1>", "<attachment 2>"],
  "tone": "<e.g. Formal and respectful>",
  "nextStep": "<what the student should do next>"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return res.json(parsed);
  } catch (err) {
    console.error('Application generation error:', err.message);
    return res.json(fallbackGenerate({ requestType, studentName, rollNumber, department, recipient, details, dateFrom, dateTo }));
  }
});

function fallbackGenerate({ requestType, studentName, rollNumber, department, recipient, details, dateFrom, dateTo }) {
  const defaultRecipient = REQUEST_TYPE_RECIPIENTS[requestType] || 'The Administrative Office';
  const finalRecipient = recipient || defaultRecipient;
  const name = studentName || 'Student';
  const roll = rollNumber || 'N/A';
  const dept = department || 'N/A';
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const dateRange = dateFrom ? `from ${dateFrom}${dateTo ? ` to ${dateTo}` : ''}` : '';

  const body = `I, ${name} (Roll No: ${roll}), a student of ${dept}, wish to submit this application regarding the following matter:\n\n${details}\n\n${dateRange ? `The period in question is ${dateRange}.\n\n` : ''}I kindly request you to consider my application and take the necessary action at the earliest convenience.`;

  return {
    applicationTitle: requestType,
    recipient: finalRecipient,
    subject: `Request: ${requestType}`,
    formalApplication: `Date: ${today}\n\nTo,\n${finalRecipient}\n\nSubject: ${requestType}\n\nRespected Sir/Madam,\n\n${body}\n\nThank you for your time and consideration.\n\nYours sincerely,\n${name}\nRoll No: ${roll}\nDepartment: ${dept}`,
    missingDetails: ['Please review and fill in any specific details before submitting.'],
    suggestedAttachments: ['Student ID Card', 'Supporting Document'],
    tone: 'Formal and respectful',
    nextStep: `Submit this application to ${finalRecipient} with the required attachments.`,
  };
}

module.exports = router;
