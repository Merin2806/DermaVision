const mongoose = require('mongoose');
const dns = require('dns');

// Override DNS to Google's public resolvers.
// Fixes: "querySrv ECONNREFUSED _mongodb._tcp..." on Windows systems
// where local/ISP DNS servers fail to resolve MongoDB Atlas SRV records.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  // Mask password for debugging output
  const maskedUri = mongoUri.replace(/:([^@]+)@/, ':****@');
  console.log(`✔ Connecting to MongoDB... [${maskedUri}]`);

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✔ MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
