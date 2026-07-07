const { MongoClient } = require("mongodb");
require("dotenv").config();

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");

    const client = new MongoClient(process.env.MONGO_URI);

    await client.connect();

    console.log("✅ MongoDB Connected Successfully!");

    await client.close();
  } catch (error) {
    console.error(error);
  }
}

testConnection();
