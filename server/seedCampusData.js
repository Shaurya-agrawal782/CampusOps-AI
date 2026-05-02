/**
 * CampusOps AI — Campus Data Seed Script
 * Run: node seedCampusData.js
 * Seeds 1 demo student + 10 realistic campus tickets
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Grievance = require('./models/Grievance');

const DEMO_STUDENT = {
  name: 'Shaurya Agrawal',
  email: 'student@campusops.ai',
  password: 'Student@123',
  phone: '9876543210',
  role: 'citizen',
};

const now = new Date();
const daysAgo = d => new Date(now - d * 86400000);

const TICKETS = [
  {
    title: 'Hostel B water unavailable for 2 days',
    description: 'Hostel B me 2 din se paani nahi aa raha. Students are unable to wash and use washrooms properly.',
    category: 'Hostel', priority: 'high', status: 'in-review',
    department: 'Hostel Warden / Hostel Maintenance',
    location: { address: 'Hostel B, Block 2', coordinates: { lat: 28.61, lng: 77.20 } },
    aiClassification: {
      campusUnit: 'Hostel Warden / Hostel Maintenance', issueType: 'Issue',
      suggestedAction: 'Contact plumbing maintenance team immediately. Check water tank levels and pump functionality.',
      studentMessage: 'Your complaint has been registered as high priority. The hostel warden has been notified.',
      confidence: 91, sentiment: 'Frustrated', detectedLanguage: 'Hinglish',
      summary: 'Water supply disruption in Hostel B for 2 days affecting multiple students.',
      requiresAdminReview: true, isUrgent: true,
    },
    createdAt: daysAgo(1),
  },
  {
    title: 'Canteen food smells bad — students feeling sick',
    description: 'The canteen food smells rotten. Multiple students complained of stomach ache after lunch today.',
    category: 'Canteen', priority: 'critical', status: 'escalated',
    department: 'Canteen Committee / Food Services',
    location: { address: 'Main Canteen, Ground Floor', coordinates: { lat: 28.61, lng: 77.20 } },
    aiClassification: {
      campusUnit: 'Canteen Committee / Food Services', issueType: 'Emergency',
      suggestedAction: 'Immediately halt food service. Conduct hygiene audit. Involve campus medical room if students feel sick.',
      studentMessage: 'This is treated as an emergency. Medical room has been notified. Please visit if you feel unwell.',
      confidence: 95, sentiment: 'Angry', detectedLanguage: 'English',
      summary: 'Food quality emergency at main canteen — multiple students reporting illness after lunch.',
      requiresAdminReview: true, isUrgent: true,
    },
    createdAt: daysAgo(0),
  },
  {
    title: 'Library WiFi not working before exams',
    description: 'WiFi in the central library is completely down. Exams are next week and students cannot access study resources.',
    category: 'Library', priority: 'high', status: 'in-progress',
    department: 'Library Office',
    location: { address: 'Central Library, 1st Floor', coordinates: { lat: 28.61, lng: 77.20 } },
    aiClassification: {
      campusUnit: 'Library Office', issueType: 'Issue',
      suggestedAction: 'IT Support to check router configuration. Consider temporary hotspot solution until fixed.',
      studentMessage: 'IT Support has been assigned. Expected resolution within 24 hours.',
      confidence: 88, sentiment: 'Worried', detectedLanguage: 'English',
      summary: 'Library WiFi outage during pre-exam period affecting student study sessions.',
      requiresAdminReview: false, isUrgent: true,
    },
    createdAt: daysAgo(2),
  },
  {
    title: 'Computer Lab 2 systems not starting',
    description: '6 out of 10 computers in Computer Lab 2 are not starting. Practical classes are getting disrupted.',
    category: 'Lab / IT', priority: 'medium', status: 'submitted',
    department: 'IT Support / Lab Assistant',
    location: { address: 'Computer Lab 2, Block C', coordinates: { lat: 28.61, lng: 77.20 } },
    aiClassification: {
      campusUnit: 'IT Support / Lab Assistant', issueType: 'Issue',
      suggestedAction: 'Lab technician should inspect hardware. Check power supply and boot logs.',
      studentMessage: 'Your request has been forwarded to IT Support. A technician will be assigned shortly.',
      confidence: 83, sentiment: 'Confused', detectedLanguage: 'English',
      summary: '60% of machines in Computer Lab 2 are non-functional, disrupting practical sessions.',
      requiresAdminReview: false, isUrgent: false,
    },
    createdAt: daysAgo(3),
  },
  {
    title: 'Classroom projector not working in Block A',
    description: 'The projector in Block A, Room 204 has stopped working. Professor unable to show presentations.',
    category: 'Classroom', priority: 'medium', status: 'resolved',
    department: 'Academic Block Maintenance',
    location: { address: 'Block A, Room 204', coordinates: { lat: 28.61, lng: 77.20 } },
    aiClassification: {
      campusUnit: 'Academic Block Maintenance', issueType: 'Issue',
      suggestedAction: 'Check HDMI cable connection and projector bulb. Replace bulb if needed.',
      studentMessage: 'Maintenance team has been informed. Temporary arrangement will be made.',
      confidence: 79, sentiment: 'Calm', detectedLanguage: 'English',
      summary: 'Projector malfunction in classroom affecting lecture delivery.',
      requiresAdminReview: false, isUrgent: false,
    },
    createdAt: daysAgo(5),
  },
  {
    title: 'College bus Route 3 delayed daily by 45 mins',
    description: 'Route 3 college bus is consistently 45 minutes late every day. Students miss first period regularly.',
    category: 'Transport', priority: 'medium', status: 'in-review',
    department: 'Transport Office',
    location: { address: 'Bus Stop — Route 3 Origin', coordinates: { lat: 28.61, lng: 77.20 } },
    aiClassification: {
      campusUnit: 'Transport Office', issueType: 'Issue',
      suggestedAction: 'Review bus scheduling and driver route timings. Consider temporary re-routing.',
      studentMessage: 'Transport office has been notified. A review of Route 3 schedule is underway.',
      confidence: 85, sentiment: 'Frustrated', detectedLanguage: 'English',
      summary: 'Persistent 45-minute delay on Route 3 causing students to miss morning classes.',
      requiresAdminReview: false, isUrgent: false,
    },
    createdAt: daysAgo(4),
  },
  {
    title: 'Fee payment done but portal shows pending',
    description: 'I paid my semester fees via UPI 3 days ago. The portal still shows PENDING and I cannot access results.',
    category: 'Accounts / Fees', priority: 'high', status: 'in-progress',
    department: 'Accounts Department',
    location: { address: 'Online / Accounts Office', coordinates: { lat: 28.61, lng: 77.20 } },
    aiClassification: {
      campusUnit: 'Accounts Department', issueType: 'Request',
      suggestedAction: 'Student should share payment receipt. Accounts team to verify transaction and update portal manually.',
      studentMessage: 'Please share your UPI transaction ID at accounts@campusops.ai. Team will resolve within 1 working day.',
      confidence: 90, sentiment: 'Worried', detectedLanguage: 'English',
      summary: 'Fee payment recorded by bank but not reflected in portal — blocking result access.',
      requiresAdminReview: true, isUrgent: true,
    },
    createdAt: daysAgo(3),
  },
  {
    title: 'Exam form correction request — wrong DOB entered',
    description: 'My date of birth is incorrect on the exam registration form. I filled wrong data accidentally. Please correct.',
    category: 'Exam Cell', priority: 'high', status: 'submitted',
    department: 'Examination Cell',
    location: { address: 'Examination Cell', coordinates: { lat: 28.61, lng: 77.20 } },
    aiClassification: {
      campusUnit: 'Examination Cell', issueType: 'Request',
      suggestedAction: 'Student to submit written request with college ID and correct DOB proof to exam cell.',
      studentMessage: 'Please visit the Exam Cell with your original documents. Correction window closes 2 days before exam.',
      confidence: 87, sentiment: 'Worried', detectedLanguage: 'English',
      summary: 'Exam form correction needed for incorrect date of birth entry.',
      requiresAdminReview: true, isUrgent: true,
    },
    createdAt: daysAgo(1),
  },
  {
    title: 'Streetlight not working near Girls Hostel road',
    description: 'The streetlight on the road leading to Girls Hostel has been off for 4 days. Students feel unsafe at night.',
    category: 'Security', priority: 'critical', status: 'escalated',
    department: 'Campus Security Office',
    location: { address: 'Girls Hostel Road, North Campus', coordinates: { lat: 28.61, lng: 77.20 } },
    aiClassification: {
      campusUnit: 'Campus Security Office', issueType: 'Emergency',
      suggestedAction: 'Security team + Maintenance to immediately fix lighting. Assign security guard to the area until repaired.',
      studentMessage: 'This has been escalated to security and maintenance heads. Night security will patrol the area tonight.',
      confidence: 94, sentiment: 'Angry', detectedLanguage: 'English',
      summary: 'Safety hazard — streetlight outage on Girls Hostel road for 4+ days creating security risk.',
      requiresAdminReview: true, isUrgent: true,
    },
    createdAt: daysAgo(4),
  },
  {
    title: 'Scholarship document verification still pending',
    description: 'I submitted all scholarship documents 3 weeks ago. No update from scholarship cell. Merit list is releasing soon.',
    category: 'Scholarship Cell', priority: 'medium', status: 'in-review',
    department: 'Scholarship / Student Welfare Office',
    location: { address: 'Student Welfare Office', coordinates: { lat: 28.61, lng: 77.20 } },
    aiClassification: {
      campusUnit: 'Scholarship / Student Welfare Office', issueType: 'Request',
      suggestedAction: 'Scholarship cell to verify submitted documents and update status. Student to follow up with application reference number.',
      studentMessage: 'Your documents are under review. You will receive an update via email within 5 working days.',
      confidence: 80, sentiment: 'Confused', detectedLanguage: 'English',
      summary: '3-week pending scholarship verification threatening merit list eligibility.',
      requiresAdminReview: false, isUrgent: false,
    },
    createdAt: daysAgo(7),
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create or fetch demo student
    let student = await User.findOne({ email: DEMO_STUDENT.email });
    if (!student) {
      student = new User(DEMO_STUDENT);
      await student.save();
      console.log('👤 Demo student created:', DEMO_STUDENT.email);
    } else {
      console.log('👤 Demo student exists:', DEMO_STUDENT.email);
    }

    // Remove old seeded tickets to allow re-seeding cleanly
    await Grievance.deleteMany({ citizenEmail: DEMO_STUDENT.email });
    console.log('🗑  Cleared old demo tickets');

    // Insert fresh tickets
    for (let i = 0; i < TICKETS.length; i++) {
      const t = TICKETS[i];
      const g = new Grievance({
        ...t,
        citizen: student._id,
        citizenName: DEMO_STUDENT.name,
        citizenEmail: DEMO_STUDENT.email,
        citizenPhone: DEMO_STUDENT.phone,
        dateOfIncident: t.createdAt,
        createdAt: t.createdAt,
      });
      await g.save();
      console.log(`  ✓ [${i+1}/10] ${t.category} — ${t.priority} — ${t.title.substring(0, 50)}`);
    }

    console.log('\n🎉 Seed complete!');
    console.log('   Student login: student@campusops.ai / Student@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
