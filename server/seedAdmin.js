/**
 * CampusOps AI — Admin Seed Script
 * Run once: node seedAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN = {
  name:     'Campus Admin',
  email:    'admin@campusops.ai',
  password: 'Admin@123',
  phone:    '9999999999',
  role:     'admin',
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${ADMIN.email}`);
      process.exit(0);
    }

    const admin = new User(ADMIN);
    await admin.save();

    console.log('🎉 Admin account created!');
    console.log('   Email   :', ADMIN.email);
    console.log('   Password:', ADMIN.password);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
