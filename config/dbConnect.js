const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();
const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_DB_URL);
    console.log('DBconnected');
  } catch {
    console.log('not connected');
  }
};

module.exports = dbConnect;
