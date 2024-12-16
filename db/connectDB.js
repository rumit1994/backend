import mongoose from "mongoose";

const connectToDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB Successfully");
  } catch (error) {
    console.log("Failed to connect DB", error.message);
  }
};
export default connectToDB;







