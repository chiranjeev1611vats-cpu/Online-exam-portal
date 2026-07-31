require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: 'admin@examportal.com' });
  if (!exists) {
    await User.create({ name: 'Admin', email: 'admin@examportal.com', password: 'admin123', role: 'admin' });
    console.log('Admin user created: admin@examportal.com / admin123');
  } else {
    console.log('Admin already exists: admin@examportal.com');
  }
  process.exit(0);
})();
