const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is Connected Successfully");
  } catch (error) {
    console.log("MongoDB is Not Connected ");
    process.exit(1);
  }
};

module.exports = connectDB;
