const mongoose = require('mongoose');
const dns = require('dns');

// Override DNS to Google's public resolvers.
// Fixes: "querySrv ECONNREFUSED _mongodb._tcp..." on Windows systems
// where local/ISP DNS servers fail to resolve MongoDB Atlas SRV records.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
