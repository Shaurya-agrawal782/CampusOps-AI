/**
 * CampusOps AI — Keyword-based Campus Issue Classifier (Fallback)
 * Used when Gemini API key is not available.
 */

const campusKeywords = {
  'Hostel': {
    keywords: [
      'hostel', 'room', 'dorm', 'dormitory', 'roommate', 'warden', 'mess',
      'paani', 'water', 'bathroom', 'toilet', 'washroom', 'geyser', 'hot water',
      'electricity hostel', 'wifi hostel', 'bed', 'mattress', 'window', 'door lock',
      'hostel b', 'hostel a', 'hostel c', 'block', 'floor', 'corridor'
    ],
    campusUnit: 'Hostel Warden / Hostel Maintenance',
    weight: 1.0
  },
  'Canteen': {
    keywords: [
      'canteen', 'food', 'meal', 'lunch', 'dinner', 'breakfast', 'khana',
      'taste', 'smell', 'stale', 'quality', 'menu', 'price', 'hygiene',
      'sick', 'ill', 'stomach', 'vomit', 'unhygienic', 'dirty food', 'cockroach',
      'vendor', 'tiffin', 'cafeteria', 'mess food'
    ],
    campusUnit: 'Canteen Committee / Food Services',
    weight: 1.0
  },
  'Library': {
    keywords: [
      'library', 'book', 'wifi library', 'internet library', 'reading room',
      'reference', 'journal', 'periodical', 'librarian', 'fine', 'issue book',
      'return', 'catalog', 'digital', 'e-library', 'ac library', 'noise library',
      'study room', 'borrow', 'shelf'
    ],
    campusUnit: 'Library Office',
    weight: 1.0
  },
  'Lab / IT': {
    keywords: [
      'lab', 'laboratory', 'computer', 'laptop', 'pc', 'internet', 'wifi',
      'network', 'printer', 'projector', 'software', 'hardware', 'server',
      'password', 'portal', 'erp', 'login', 'account', 'it support',
      'system crash', 'slow internet', 'equipment', 'instrument', 'chemistry lab',
      'physics lab', 'biology lab', 'computer lab', 'coding', 'ide', 'vscode'
    ],
    campusUnit: 'IT Support / Lab Assistant',
    weight: 1.0
  },
  'Classroom': {
    keywords: [
      'classroom', 'class', 'lecture', 'hall', 'bench', 'chair', 'blackboard',
      'whiteboard', 'projector class', 'ac class', 'fan class', 'light class',
      'audio', 'speaker', 'microphone', 'seating', 'ventilation class'
    ],
    campusUnit: 'Academic Block Maintenance',
    weight: 1.0
  },
  'Transport': {
    keywords: [
      'bus', 'transport', 'vehicle', 'route', 'driver', 'timing', 'schedule',
      'late bus', 'shuttle', 'pick up', 'drop', 'taxi', 'auto', 'parking',
      'bicycle', 'bike', 'cab', 'commute'
    ],
    campusUnit: 'Transport Office',
    weight: 1.0
  },
  'Exam Cell': {
    keywords: [
      'exam', 'examination', 'result', 'marks', 'grade', 'marksheet', 'admit card',
      'hall ticket', 'datesheet', 'timetable exam', 'paper', 'question paper',
      'answer sheet', 'revaluation', 'rechecking', 'back paper', 'supplementary',
      'controller', 'exam cell', 'fee exam', 'form'
    ],
    campusUnit: 'Examination Cell',
    weight: 1.0
  },
  'Accounts / Fees': {
    keywords: [
      'fee', 'fees', 'payment', 'receipt', 'challan', 'dues', 'fine',
      'accounts', 'refund', 'hostel fee', 'tuition fee', 'late fee',
      'scholarship money', 'stipend', 'bank', 'neft', 'online payment',
      'fee extension', 'installment'
    ],
    campusUnit: 'Accounts Department',
    weight: 1.0
  },
  'Maintenance': {
    keywords: [
      'repair', 'broken', 'leakage', 'leak', 'damage', 'maintenance',
      'plumber', 'electrician', 'switch', 'socket', 'fan not working',
      'light not working', 'bulb', 'ceiling', 'wall', 'paint', 'floor crack',
      'door broken', 'window broken', 'pipe burst', 'seepage'
    ],
    campusUnit: 'Campus Maintenance Team',
    weight: 1.0
  },
  'Security': {
    keywords: [
      'security', 'guard', 'harassment', 'ragging', 'fight', 'theft', 'stolen',
      'missing', 'suspicious', 'outsider', 'violence', 'threat', 'unsafe',
      'fire', 'smoke', 'emergency', 'cctv', 'camera', 'gate', 'entry', 'pass',
      'id card'
    ],
    campusUnit: 'Campus Security Office',
    weight: 1.2   // higher weight — safety issues
  },
  'Sports': {
    keywords: [
      'sports', 'ground', 'court', 'gym', 'gymnasium', 'equipment sports',
      'cricket', 'football', 'basketball', 'badminton', 'tennis', 'swimming',
      'pool', 'coach', 'tournament', 'player', 'game', 'field'
    ],
    campusUnit: 'Sports Department',
    weight: 1.0
  },
  'Administration': {
    keywords: [
      'admin', 'administration', 'principal', 'director', 'dean', 'hod',
      'bonafide', 'certificate', 'noc', 'no objection', 'letter', 'document',
      'leave', 'permission', 'approval', 'complaint formal', 'registration',
      'admission', 'migration', 'transfer certificate', 'tc', 'id card'
    ],
    campusUnit: 'Administrative Office',
    weight: 1.0
  },
  'Medical Room': {
    keywords: [
      'medical', 'doctor', 'nurse', 'sick', 'ill', 'fever', 'injury', 'hurt',
      'medicine', 'tablet', 'first aid', 'hospital', 'ambulance', 'health',
      'covid', 'pandemic', 'infection', 'allergy', 'blood', 'pain', 'headache',
      'vomiting', 'unconscious', 'fainted', 'emergency medical'
    ],
    campusUnit: 'Campus Medical Room',
    weight: 1.1
  },
  'Scholarship Cell': {
    keywords: [
      'scholarship', 'stipend', 'fellowship', 'financial aid', 'merit',
      'means', 'obc', 'sc', 'st', 'minority', 'post matric', 'pre matric',
      'national scholarship', 'state scholarship', 'welfare', 'student welfare'
    ],
    campusUnit: 'Scholarship / Student Welfare Office',
    weight: 1.0
  }
};

// Priority detection
const priorityKeywords = {
  critical: [
    'fire', 'smoke', 'blast', 'explosion', 'collapse', 'emergency', 'ambulance',
    'unconscious', 'fainted', 'blood', 'violence', 'harassment', 'ragging',
    'threat', 'rape', 'assault', 'danger', 'life', 'dying', 'critical'
  ],
  high: [
    'urgent', 'immediate', 'not working since days', 'din se', '2 din', '3 din',
    'broken', 'no water', 'paani nahi', 'no electricity', 'sick', 'many students',
    'exam tomorrow', 'submission today', 'deadline'
  ],
  medium: [
    'not working', 'problem', 'issue', 'complaint', 'request', 'slow', 'bad',
    'poor', 'delay', 'pending', 'please fix', 'kafi time'
  ],
  low: [
    'suggestion', 'improve', 'minor', 'small', 'just asking', 'query',
    'information', 'inquiry', 'would like to know'
  ]
};

// Issue type detection
const requestKeywords = [
  'certificate', 'bonafide', 'noc', 'no objection', 'leave', 'permission',
  'extension', 'scholarship', 'form', 'need letter', 'request for', 'apply',
  'application', 'grant', 'approval', 'issuance'
];
const emergencyKeywords = [
  'fire', 'emergency', 'ambulance', 'unconscious', 'fainted', 'bleeding',
  'violence', 'harassment', 'ragging', 'danger', 'threat', 'assault'
];

function classifyCampusIssue(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const scores = {};

  // Score each campus category
  for (const [category, config] of Object.entries(campusKeywords)) {
    let score = 0;
    for (const keyword of config.keywords) {
      if (text.includes(keyword)) score += (config.weight || 1);
    }
    scores[category] = score;
  }

  const totalScore = Object.values(scores).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  let topCategory = 'Other';
  let confidence = 30;
  let alternatives = [];

  if (totalScore > 0) {
    topCategory = sorted[0][0];
    confidence = Math.min(Math.round((sorted[0][1] / totalScore) * 100), 97);
    alternatives = sorted
      .slice(1, 3)
      .filter(([, s]) => s > 0)
      .map(([dept, s]) => ({
        department: campusKeywords[dept].campusUnit,
        confidence: Math.round((s / totalScore) * 100)
      }));
  }

  const campusUnit = campusKeywords[topCategory]?.campusUnit || 'Student Support Desk';

  // Determine priority
  let priority = 'medium';
  for (const kw of priorityKeywords.critical) {
    if (text.includes(kw)) { priority = 'critical'; break; }
  }
  if (priority !== 'critical') {
    for (const kw of priorityKeywords.high) {
      if (text.includes(kw)) { priority = 'high'; break; }
    }
  }
  if (priority === 'medium') {
    for (const kw of priorityKeywords.low) {
      if (text.includes(kw)) { priority = 'low'; break; }
    }
  }

  // Safety override
  if (priority === 'critical') {
    if (text.includes('medical') || text.includes('fainted') || text.includes('unconscious') || text.includes('blood')) {
      return buildResult(topCategory, 'Medical Room', 'Campus Medical Room', 'critical', 'Emergency', confidence, alternatives, title, description);
    }
    return buildResult(topCategory, 'Security', 'Campus Security Office', 'critical', 'Emergency', confidence, alternatives, title, description);
  }

  // Determine issue type
  let issueType = 'Issue';
  if (emergencyKeywords.some(kw => text.includes(kw))) issueType = 'Emergency';
  else if (requestKeywords.some(kw => text.includes(kw))) issueType = 'Request';
  else if (text.includes('information') || text.includes('query') || text.includes('know')) issueType = 'Information';

  // Sentiment
  let sentiment = 'Calm';
  if (priority === 'high') sentiment = 'Worried';
  if (text.includes('frustrated') || text.includes('angry') || text.includes('worst')) sentiment = 'Angry';
  if (text.includes('kuch samajh') || text.includes('confused') || text.includes('not sure')) sentiment = 'Confused';

  return buildResult(topCategory, topCategory, campusUnit, priority, issueType, confidence, alternatives, title, description, sentiment);
}

function buildResult(rawCategory, category, campusUnit, priority, issueType, confidence, alternatives, title, description, sentiment = 'Calm') {
  const isUrgent = priority === 'high' || priority === 'critical';
  return {
    category,
    campusUnit,
    priority,
    issueType,
    sentiment,
    confidence,
    alternatives,
    summary: `Student reports: ${title}. Routed to ${campusUnit} for action.`,
    suggestedAction: `${campusUnit} should review and address this ${issueType.toLowerCase()} promptly.`,
    studentMessage: isUrgent
      ? `Your ${issueType.toLowerCase()} has been flagged as high priority and sent to ${campusUnit}. You will be contacted soon.`
      : `Thank you for reaching out. Your ${issueType.toLowerCase()} has been forwarded to ${campusUnit}. We'll update you shortly.`,
    requiresAdminReview: isUrgent
  };
}

function checkDuplicate(title, description, existingGrievances) {
  const text = `${title} ${description}`.toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 3);

  for (const grievance of existingGrievances) {
    const existingText = `${grievance.title} ${grievance.description}`.toLowerCase();
    let matchCount = 0;

    for (const word of words) {
      if (existingText.includes(word)) matchCount++;
    }

    const similarity = words.length > 0 ? (matchCount / words.length) * 100 : 0;

    if (similarity > 60) {
      return {
        isDuplicate: true,
        similarity: Math.round(similarity),
        existingGrievance: {
          trackingId: grievance.trackingId,
          title: grievance.title,
          status: grievance.status
        }
      };
    }
  }

  return { isDuplicate: false, similarity: 0 };
}

module.exports = { classifyCampusIssue, checkDuplicate };
