const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { auth, requireRole } = require('../middleware/auth');
const Grievance = require('../models/Grievance');

const router = express.Router();

// GET /api/admin/ai-summary
router.get('/ai-summary', auth, requireRole('admin', 'department'), async (req, res) => {
  try {
    // Grab last 50 open tickets
    const tickets = await Grievance.find({ status: { $nin: ['closed', 'resolved'] } })
      .select('category department priority status aiClassification.campusUnit aiClassification.issueType createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    if (!tickets.length) {
      return res.json({ summary: 'No active campus issues at the moment. The campus is operating smoothly.', generatedAt: new Date() });
    }

    // Build a compact context string
    const breakdown = tickets.reduce((acc, t) => {
      const key = t.category || 'Other';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const criticalCount = tickets.filter(t => t.priority === 'critical').length;
    const highCount     = tickets.filter(t => t.priority === 'high').length;
    const topCategories = Object.entries(breakdown).sort((a, b) => b[1] - a[1]).slice(0, 5);

    if (!process.env.GEMINI_API_KEY) {
      // Fallback: generate summary from data
      const top = topCategories.map(([cat, cnt]) => `${cat} (${cnt})`).join(', ');
      return res.json({
        summary: `Current campus situation: ${tickets.length} active issues. Top affected areas: ${top}. ${criticalCount > 0 ? `⚠️ ${criticalCount} critical issue(s) require immediate attention.` : ''} ${highCount > 0 ? `${highCount} high-priority issue(s) need prompt action.` : ''} Campus units should coordinate for timely resolution.`,
        generatedAt: new Date()
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are CampusOps AI, an intelligent campus operations copilot.
Analyze the following active campus issue summary and write a concise, professional 3-4 sentence situation briefing for the admin dashboard.

Active Issues: ${tickets.length}
Critical: ${criticalCount} | High: ${highCount}
Category Breakdown: ${JSON.stringify(breakdown)}

Rules:
- Be specific about the most active areas and their severity.
- Mention what campus units should take action.
- Keep it under 80 words.
- Do not use bullet points. Write in plain flowing sentences.
- Return ONLY the summary text, no labels, no JSON.
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    res.json({ summary, generatedAt: new Date() });
  } catch (err) {
    console.error('AI Summary error:', err.message);
    res.json({ summary: 'Unable to generate AI summary at this time. Please check ticket data manually.', generatedAt: new Date() });
  }
});

module.exports = router;
