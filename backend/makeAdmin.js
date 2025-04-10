const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// REPLACE THIS WITH YOUR NEW EMAIL
const emailToPromote = 'admin@test.com'; 

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB...');
    
    // Find the user
    const user = await User.findOne({ email: emailToPromote });
    
    if (!user) {
      console.log('User not found! Did you register on the frontend first?');
      process.exit();
    }

    // ONLY update the role. Do not touch the password.
    user.role = 'admin'; 
    
    // We use updateOne to avoid re-triggering any pre-save password hashing middleware
    await User.updateOne({ _id: user._id }, { $set: { role: 'admin' } });
    
    console.log(`Success! ${user.name} is now an Admin.`);
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });