const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
require("dotenv").config();

const DB_Connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
        
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = DB_Connection;
