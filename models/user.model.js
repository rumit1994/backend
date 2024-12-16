import mongoose from "mongoose";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    ProfileImage:{
      type:String,
      required: true  
    },
    videoUploads:{
      type:String,
      required: true
    },
    refreshToken: {
      type: String
    }
    },
    { timestamps: true }
  );
 const User = mongoose.model("Users", userSchema);
export default User;