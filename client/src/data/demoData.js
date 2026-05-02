/**
 * CampusOps AI — Frontend Demo Data
 * Used as fallback when database is empty or in Demo Mode.
 */

const now = new Date();
const daysAgo = d => new Date(now - d * 86400000).toISOString();

export const DEMO_TICKETS = [
  {
    _id: 'demo-001', trackingId: 'CAMP-2026-1001',
    title: 'Hostel B water unavailable for 2 days',
    description: 'Hostel B me 2 din se paani nahi aa raha. Students cannot use washrooms properly.',
    category: 'Hostel', priority: 'high', status: 'in-review',
    department: 'Hostel Warden / Hostel Maintenance',
    citizenName: 'Shaurya Agrawal',
    location: { address: 'Hostel B, Block 2' },
    createdAt: daysAgo(1),
    aiClassification: {
      campusUnit: 'Hostel Warden / Hostel Maintenance', issueType: 'Issue',
      sentiment: 'Frustrated', confidence: 91, isUrgent: true,
      suggestedAction: 'Contact plumbing maintenance. Check water tank and pump.',
      studentMessage: 'Hostel warden has been notified. High priority.',
      summary: 'Water supply disruption in Hostel B for 2+ days.',
      requiresAdminReview: true,
    },
  },
  {
    _id: 'demo-002', trackingId: 'CAMP-2026-1002',
    title: 'Canteen food smells bad — students falling sick',
    description: 'Multiple students complained of stomach ache after lunch.',
    category: 'Canteen', priority: 'critical', status: 'escalated',
    department: 'Canteen Committee / Food Services',
    citizenName: 'Priya Sharma',
    location: { address: 'Main Canteen, Ground Floor' },
    createdAt: daysAgo(0),
    aiClassification: {
      campusUnit: 'Canteen Committee / Food Services', issueType: 'Emergency',
      sentiment: 'Angry', confidence: 95, isUrgent: true,
      suggestedAction: 'Halt food service. Conduct hygiene audit. Notify medical room.',
      studentMessage: 'Treated as emergency. Medical room notified.',
      summary: 'Food quality emergency at main canteen.',
      requiresAdminReview: true,
    },
  },
  {
    _id: 'demo-003', trackingId: 'CAMP-2026-1003',
    title: 'Library WiFi not working before exams',
    description: 'WiFi in central library is completely down. Exams are next week.',
    category: 'Library', priority: 'high', status: 'in-progress',
    department: 'Library Office',
    citizenName: 'Ravi Kumar',
    location: { address: 'Central Library, 1st Floor' },
    createdAt: daysAgo(2),
    aiClassification: {
      campusUnit: 'Library Office', issueType: 'Issue',
      sentiment: 'Worried', confidence: 88, isUrgent: true,
      suggestedAction: 'IT Support to check router. Provide temporary hotspot.',
      studentMessage: 'IT Support assigned. Resolution expected in 24 hours.',
      summary: 'Library WiFi outage during pre-exam period.',
      requiresAdminReview: false,
    },
  },
  {
    _id: 'demo-004', trackingId: 'CAMP-2026-1004',
    title: 'Computer Lab 2 systems not starting',
    description: '6 out of 10 computers in Lab 2 are not starting.',
    category: 'Lab / IT', priority: 'medium', status: 'submitted',
    department: 'IT Support / Lab Assistant',
    citizenName: 'Anjali Singh',
    location: { address: 'Computer Lab 2, Block C' },
    createdAt: daysAgo(3),
    aiClassification: {
      campusUnit: 'IT Support / Lab Assistant', issueType: 'Issue',
      sentiment: 'Confused', confidence: 83, isUrgent: false,
      suggestedAction: 'Lab technician to inspect hardware and boot logs.',
      studentMessage: 'Forwarded to IT Support. Technician assigned shortly.',
      summary: '60% of lab machines non-functional disrupting practicals.',
      requiresAdminReview: false,
    },
  },
  {
    _id: 'demo-005', trackingId: 'CAMP-2026-1005',
    title: 'Classroom projector not working in Block A',
    description: 'Projector in Block A Room 204 stopped working.',
    category: 'Classroom', priority: 'medium', status: 'resolved',
    department: 'Academic Block Maintenance',
    citizenName: 'Mohammed Khan',
    location: { address: 'Block A, Room 204' },
    createdAt: daysAgo(5),
    aiClassification: {
      campusUnit: 'Academic Block Maintenance', issueType: 'Issue',
      sentiment: 'Calm', confidence: 79, isUrgent: false,
      suggestedAction: 'Check HDMI cable and projector bulb.',
      studentMessage: 'Maintenance team informed. Temporary arrangement made.',
      summary: 'Projector malfunction affecting lecture delivery.',
      requiresAdminReview: false,
    },
  },
  {
    _id: 'demo-006', trackingId: 'CAMP-2026-1006',
    title: 'College bus Route 3 delayed daily by 45 mins',
    description: 'Route 3 bus is 45 minutes late every day. Students miss first period.',
    category: 'Transport', priority: 'medium', status: 'in-review',
    department: 'Transport Office',
    citizenName: 'Sneha Patel',
    location: { address: 'Bus Stop — Route 3' },
    createdAt: daysAgo(4),
    aiClassification: {
      campusUnit: 'Transport Office', issueType: 'Issue',
      sentiment: 'Frustrated', confidence: 85, isUrgent: false,
      suggestedAction: 'Review Route 3 scheduling and driver timing.',
      studentMessage: 'Transport office notified. Route schedule under review.',
      summary: '45-minute daily delay on Route 3 causing missed classes.',
      requiresAdminReview: false,
    },
  },
  {
    _id: 'demo-007', trackingId: 'CAMP-2026-1007',
    title: 'Fee payment done but portal shows pending',
    description: 'Paid via UPI 3 days ago. Portal still shows PENDING.',
    category: 'Accounts / Fees', priority: 'high', status: 'in-progress',
    department: 'Accounts Department',
    citizenName: 'Karan Mehta',
    location: { address: 'Accounts Office / Online' },
    createdAt: daysAgo(3),
    aiClassification: {
      campusUnit: 'Accounts Department', issueType: 'Request',
      sentiment: 'Worried', confidence: 90, isUrgent: true,
      suggestedAction: 'Verify UPI transaction. Update portal manually.',
      studentMessage: 'Share UPI transaction ID to accounts team.',
      summary: 'Fee reflected in bank but not in portal — blocking result access.',
      requiresAdminReview: true,
    },
  },
  {
    _id: 'demo-008', trackingId: 'CAMP-2026-1008',
    title: 'Exam form correction — wrong DOB entered',
    description: 'My DOB is incorrect on exam registration form. Please correct.',
    category: 'Exam Cell', priority: 'high', status: 'submitted',
    department: 'Examination Cell',
    citizenName: 'Divya Nair',
    location: { address: 'Examination Cell' },
    createdAt: daysAgo(1),
    aiClassification: {
      campusUnit: 'Examination Cell', issueType: 'Request',
      sentiment: 'Worried', confidence: 87, isUrgent: true,
      suggestedAction: 'Submit written request with ID proof to exam cell.',
      studentMessage: 'Visit exam cell with original documents before deadline.',
      summary: 'Exam form DOB correction required.',
      requiresAdminReview: true,
    },
  },
  {
    _id: 'demo-009', trackingId: 'CAMP-2026-1009',
    title: 'Streetlight not working near Girls Hostel road',
    description: 'Streetlight has been off for 4 days. Students feel unsafe at night.',
    category: 'Security', priority: 'critical', status: 'escalated',
    department: 'Campus Security Office',
    citizenName: 'Sakshi Gupta',
    location: { address: 'Girls Hostel Road, North Campus' },
    createdAt: daysAgo(4),
    aiClassification: {
      campusUnit: 'Campus Security Office', issueType: 'Emergency',
      sentiment: 'Angry', confidence: 94, isUrgent: true,
      suggestedAction: 'Fix lighting immediately. Assign security patrol.',
      studentMessage: 'Escalated to security and maintenance heads.',
      summary: 'Safety hazard — streetlight outage near Girls Hostel.',
      requiresAdminReview: true,
    },
  },
  {
    _id: 'demo-010', trackingId: 'CAMP-2026-1010',
    title: 'Scholarship document verification still pending',
    description: 'Submitted all documents 3 weeks ago. No update from scholarship cell.',
    category: 'Scholarship Cell', priority: 'medium', status: 'in-review',
    department: 'Scholarship / Student Welfare Office',
    citizenName: 'Arjun Verma',
    location: { address: 'Student Welfare Office' },
    createdAt: daysAgo(7),
    aiClassification: {
      campusUnit: 'Scholarship / Student Welfare Office', issueType: 'Request',
      sentiment: 'Confused', confidence: 80, isUrgent: false,
      suggestedAction: 'Scholarship cell to verify docs and update status.',
      studentMessage: 'Documents under review. Update via email in 5 working days.',
      summary: '3-week pending verification threatening merit list eligibility.',
      requiresAdminReview: false,
    },
  },
  // --- CLUSTER DEMO TICKETS ---
  // Library WiFi Cluster Duplicates
  {
    _id: 'demo-101', trackingId: 'CAMP-2026-1101',
    title: 'Internet is down in Central Library',
    description: 'Not able to connect to library wifi since morning.',
    category: 'Library', priority: 'high', status: 'submitted',
    department: 'Library Office',
    citizenName: 'Amit Verma',
    location: { address: 'Central Library, Ground Floor' },
    createdAt: daysAgo(1),
    aiClassification: { campusUnit: 'Library Office' },
  },
  {
    _id: 'demo-102', trackingId: 'CAMP-2026-1102',
    title: 'WiFi problem in library reading hall',
    description: 'Wifi is continuously disconnecting in the reading hall area.',
    category: 'Library', priority: 'medium', status: 'submitted',
    department: 'Library Office',
    citizenName: 'Neha Gupta',
    location: { address: 'Central Library, Reading Hall' },
    createdAt: daysAgo(2),
    aiClassification: { campusUnit: 'Library Office' },
  },
  // Hostel B Water Cluster Duplicates
  {
    _id: 'demo-103', trackingId: 'CAMP-2026-1103',
    title: 'Hostel B me paani nahi aa raha',
    description: 'Subah se washroom me paani nahi hai.',
    category: 'Hostel', priority: 'high', status: 'submitted',
    department: 'Hostel Warden / Hostel Maintenance',
    citizenName: 'Rohan Das',
    location: { address: 'Hostel B, Block 1' },
    createdAt: daysAgo(0),
    aiClassification: { campusUnit: 'Hostel Warden / Hostel Maintenance' },
  },
  {
    _id: 'demo-104', trackingId: 'CAMP-2026-1104',
    title: 'No water in Hostel B washroom',
    description: 'Please fix the water issue in Hostel B immediately.',
    category: 'Hostel', priority: 'critical', status: 'submitted',
    department: 'Hostel Warden / Hostel Maintenance',
    citizenName: 'Vikram Singh',
    location: { address: 'Hostel B, 3rd Floor' },
    createdAt: daysAgo(1),
    aiClassification: { campusUnit: 'Hostel Warden / Hostel Maintenance' },
  },
  {
    _id: 'demo-105', trackingId: 'CAMP-2026-1105',
    title: 'Hostel B water supply issue from morning',
    description: 'Water is completely cut off in our wing.',
    category: 'Hostel', priority: 'high', status: 'submitted',
    department: 'Hostel Warden / Hostel Maintenance',
    citizenName: 'Aditi Rao',
    location: { address: 'Hostel B, West Wing' },
    createdAt: daysAgo(0),
    aiClassification: { campusUnit: 'Hostel Warden / Hostel Maintenance' },
  }
];

export const DEMO_STATS = {
  total: 10,
  pendingReview: 3,
  highPriority: 4,
  resolved: 1,
  aiClassified: 10,
  priorityStats: [
    { _id: 'low', count: 0 },
    { _id: 'medium', count: 4 },
    { _id: 'high', count: 4 },
    { _id: 'critical', count: 2 },
  ],
  categoryStats: [
    { _id: 'Hostel', count: 1 }, { _id: 'Canteen', count: 1 },
    { _id: 'Library', count: 1 }, { _id: 'Lab / IT', count: 1 },
    { _id: 'Security', count: 1 }, { _id: 'Accounts / Fees', count: 1 },
  ],
  departmentStats: [
    { _id: 'Hostel Warden / Hostel Maintenance', total: 1 },
    { _id: 'Canteen Committee / Food Services', total: 1 },
    { _id: 'Library Office', total: 1 },
    { _id: 'IT Support / Lab Assistant', total: 1 },
    { _id: 'Accounts Department', total: 1 },
    { _id: 'Campus Security Office', total: 2 },
    { _id: 'Examination Cell', total: 1 },
    { _id: 'Transport Office', total: 1 },
    { _id: 'Scholarship / Student Welfare Office', total: 1 },
  ],
  monthlyTrends: [
    { _id: 'Nov', count: 2, resolved: 1 },
    { _id: 'Dec', count: 4, resolved: 2 },
    { _id: 'Jan', count: 3, resolved: 3 },
    { _id: 'Feb', count: 6, resolved: 4 },
    { _id: 'Mar', count: 5, resolved: 3 },
    { _id: 'Apr', count: 10, resolved: 1 },
  ],
};

export const DEMO_AI_SUMMARY =
  'Current campus situation shows 10 active issues. Critical attention is needed for the Canteen food quality emergency and the streetlight outage near the Girls Hostel — both are escalated. Hostel water supply in Block B remains unresolved for 2+ days and needs immediate plumbing action. Library WiFi is in-progress ahead of next week\'s exams. Accounts and Exam Cell teams have high-priority requests pending student follow-up.';

// Sample cached AI triage results for quick demo examples (Part E)
export const DEMO_TRIAGE_CACHE = {
  'Hostel B me 2 din se paani nahi aa raha': {
    category: 'Hostel', campusUnit: 'Hostel Warden / Hostel Maintenance',
    priority: 'high', issueType: 'Issue', sentiment: 'Frustrated',
    confidence: 91, detectedLanguage: 'Hinglish',
    summary: 'Water supply disruption in Hostel B for 2 days affecting student hygiene.',
    suggestedAction: 'Contact plumbing maintenance team. Check water tank levels and pump.',
    studentMessage: 'Your complaint is high priority. The hostel warden has been notified.',
    requiresAdminReview: true, isUrgent: true,
  },
  'Canteen food smells bad and students are feeling sick': {
    category: 'Canteen', campusUnit: 'Canteen Committee / Food Services',
    priority: 'critical', issueType: 'Emergency', sentiment: 'Angry',
    confidence: 95, detectedLanguage: 'English',
    summary: 'Food quality emergency at main canteen with reported illness.',
    suggestedAction: 'Halt food service immediately. Conduct hygiene audit. Notify medical room.',
    studentMessage: 'Treated as emergency. Medical room has been notified.',
    requiresAdminReview: true, isUrgent: true,
  },
  'Library WiFi is not working before exams': {
    category: 'Library', campusUnit: 'Library Office',
    priority: 'high', issueType: 'Issue', sentiment: 'Worried',
    confidence: 88, detectedLanguage: 'English',
    summary: 'Library WiFi outage during pre-exam period.',
    suggestedAction: 'IT Support to check router. Provide temporary hotspot.',
    studentMessage: 'IT Support assigned. Resolution expected in 24 hours.',
    requiresAdminReview: false, isUrgent: true,
  },
  'There is a fire smell near chemistry lab': {
    category: 'Security', campusUnit: 'Campus Security Office',
    priority: 'critical', issueType: 'Emergency', sentiment: 'Angry',
    confidence: 97, detectedLanguage: 'English',
    summary: 'Potential fire/gas hazard reported near chemistry laboratory.',
    suggestedAction: 'Evacuate the area immediately. Contact security and fire safety team.',
    studentMessage: 'This is a critical emergency. Please evacuate and call security at once.',
    requiresAdminReview: true, isUrgent: true,
  },
  'Fee payment done but portal still shows pending': {
    category: 'Accounts / Fees', campusUnit: 'Accounts Department',
    priority: 'high', issueType: 'Request', sentiment: 'Worried',
    confidence: 90, detectedLanguage: 'English',
    summary: 'Fee payment completed but not reflected in student portal.',
    suggestedAction: 'Share UPI transaction ID with accounts team for manual verification.',
    studentMessage: 'Send your transaction ID to accounts@campusops.ai for resolution.',
    requiresAdminReview: true, isUrgent: true,
  },
};

// Campus location → coordinate mapping for Live Crisis Map (demo mode)
export const campusLocationCoordinates = {
  'Hostel B':                 { lat: 23.2599, lng: 77.4126 },
  'Central Library':          { lat: 23.2605, lng: 77.4132 },
  'Main Canteen':             { lat: 23.2601, lng: 77.4140 },
  'Computer Lab 2':           { lat: 23.2610, lng: 77.4138 },
  'Block A Room 204':         { lat: 23.2595, lng: 77.4120 },
  'Route 3':                  { lat: 23.2620, lng: 77.4150 },
  'Accounts Office':          { lat: 23.2608, lng: 77.4125 },
  'Exam Cell':                { lat: 23.2592, lng: 77.4135 },
  'Girls Hostel Road':        { lat: 23.2615, lng: 77.4118 },
  'Student Welfare Office':   { lat: 23.2603, lng: 77.4129 },
  'Chemistry Lab':            { lat: 23.2612, lng: 77.4142 },
  'Academic Block':           { lat: 23.2597, lng: 77.4130 },
};

// Default campus centre used when no coordinate match is found
export const CAMPUS_CENTER = { lat: 23.2605, lng: 77.4130 };

// Sample cached application outputs (Part E)
export const DEMO_APP_CACHE = {
  'I need a bonafide certificate for scholarship submission.': {
    applicationTitle: 'Bonafide Certificate Request',
    recipient: 'The Registrar / Student Welfare Office',
    subject: 'Request for Issuance of Bonafide Certificate for Scholarship Application',
    formalApplication: `Date: ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}

To,
The Registrar / Student Welfare Office
[College Name]

Subject: Request for Issuance of Bonafide Certificate for Scholarship Application

Respected Sir/Madam,

I am writing to respectfully request the issuance of a Bonafide Certificate from the institution. I require this certificate as a mandatory document for my scholarship application, which I am submitting to the concerned scholarship authority.

I am a bonafide student of this institution and confirm that all my academic and enrollment details are current and active.

I kindly request you to issue the certificate at the earliest convenience so that I may meet the scholarship submission deadline.

I would be grateful for your prompt assistance in this matter.

Yours sincerely,
[Student Name]
Roll No: [Roll Number]
Department: [Department]`,
    missingDetails: ['Student Name', 'Roll Number', 'Department', 'Scholarship Name', 'Submission Deadline'],
    suggestedAttachments: ['Student ID Card', 'Scholarship Application Form', 'Enrollment Proof'],
    tone: 'Formal and respectful',
    nextStep: 'Submit this application to the Student Welfare Office with your ID card. Collect the certificate within 2-3 working days.',
  },
  'I need hostel leave for 3 days because of family function.': {
    applicationTitle: 'Hostel Leave Request',
    recipient: 'The Hostel Warden',
    subject: 'Request for Hostel Leave — Family Function',
    formalApplication: `Date: ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}

To,
The Hostel Warden
[Hostel Name], [College Name]

Subject: Request for Hostel Leave for 3 Days Due to Family Function

Respected Sir/Madam,

I am writing to request hostel leave for a period of 3 days on account of a family function that requires my presence at home.

I assure you that I will maintain communication and return to the hostel on the specified date. I will ensure that my room is locked and belongings are secure during my absence.

Kindly grant me leave and oblige.

Yours sincerely,
[Student Name]
Room No: [Room Number]
Department: [Department]`,
    missingDetails: ['Exact leave dates', 'Student Name', 'Room Number', 'Parent/Guardian contact'],
    suggestedAttachments: ['Parent/Guardian Permission Letter', 'Student ID Card'],
    tone: 'Formal and respectful',
    nextStep: 'Submit this to your hostel warden at least 1 day before your planned leave date.',
  },
};
