const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/SAGAR KUMAR/OneDrive/Pictures/flipkart/shopora-api/.env' });
const User = require('./models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const makeAdmin = async (email) => {
    await connectDB();
    try {
        const user = await User.findOneAndUpdate({ email: email }, { role: 'admin' }, { new: true });
        if (user) {
            console.log(`✅ SUCCESS: User ${user.name} (${user.email}) is now an ADMIN.`);
        } else {
            console.log(`❌ User with email ${email} not found.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

makeAdmin('admin@gmail.com');
