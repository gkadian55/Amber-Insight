const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`Amber Insight: Connected to the Grid (Database: ${conn.connection.host})`);
    } catch (error) {
        console.error(`Database Connection Failure: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;