const mongoose = require('mongoose');

const timelineEntrySchema = new mongoose.Schema({
  status: String,
  timestamp: { type: Date, default: Date.now },
  note: String,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const CAMPUS_CATEGORIES = [
  'Hostel', 'Canteen', 'Library', 'Lab / IT', 'Classroom',
  'Transport', 'Exam Cell', 'Accounts / Fees', 'Maintenance',
  'Security', 'Sports', 'Administration', 'Medical Room',
  'Scholarship Cell', 'Other'
];

const CAMPUS_UNITS = [
  'Hostel Warden / Hostel Maintenance',
  'Canteen Committee / Food Services',
  'Library Office',
  'IT Support / Lab Assistant',
  'Academic Block Maintenance',
  'Transport Office',
  'Examination Cell',
  'Accounts Department',
  'Campus Maintenance Team',
  'Campus Security Office',
  'Sports Department',
  'Administrative Office',
  'Campus Medical Room',
  'Scholarship / Student Welfare Office',
  'Student Support Desk',
  // Legacy civic values kept so old seeded data doesn't break
  'Public Works', 'Sanitation', 'Water Authority', 'Electricity Board', 'Municipal Safety'
];

const grievanceSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    // Allow campus categories + old civic ones so seeded docs stay valid
    default: 'Other'
  },
  department: {
    type: String,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['submitted', 'in-review', 'in-progress', 'resolved', 'escalated', 'reopened', 'closed'],
    default: 'submitted'
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  dateOfIncident: {
    type: Date
  },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String
  }],
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  citizenName: String,
  citizenEmail: String,
  citizenPhone: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  aiClassification: {
    // New campus fields
    campusUnit: String,
    issueType: {
      type: String,
      enum: ['Issue', 'Request', 'Emergency', 'Information'],
      default: 'Issue'
    },
    suggestedAction: String,
    studentMessage: String,
    requiresAdminReview: { type: Boolean, default: false },
    // Retained fields (used by frontend display)
    suggestedDepartment: String,   // alias → campusUnit for backward compat
    confidence: Number,
    alternatives: [{
      department: String,
      confidence: Number
    }],
    summary: String,
    sentiment: {
      type: String,
      default: 'Calm'
    },
    detectedLanguage: {
      type: String,
      default: 'English'
    },
    translatedTitle: String,
    translatedDescription: String,
    isUrgent: {
      type: Boolean,
      default: false
    },
    verification: {
      status: String,
      reason: String,
      confidence: Number
    },
    keyEntities: [String]
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: Date
  },
  duplicateOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grievance',
    default: null
  },
  timeline: [timelineEntrySchema]
}, {
  timestamps: true
});

// Generate tracking ID before save
grievanceSchema.pre('validate', async function(next) {
  if (!this.trackingId) {
    const count = await mongoose.model('Grievance').countDocuments();
    this.trackingId = `GRV-${String(count + 1001).padStart(4, '0')}`;
  }
  next();
});

// Add initial timeline entry
grievanceSchema.pre('save', function(next) {
  if (this.isNew) {
    this.timeline.push({
      status: 'submitted',
      note: 'Request submitted by student',
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Grievance', grievanceSchema);
