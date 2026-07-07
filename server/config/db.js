const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("========== FULL ERROR ==========");
    console.error(error);
    console.error("================================");
    process.exit(1);
  }
};

module.exports = connectDB;
