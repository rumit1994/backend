import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import  jwt from "jsonwebtoken"
import { generateToken } from "../jwt.js"
import { verifyRefreshToken } from "../jwt.js"


export const refreshUserToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
   // return next(errorHandler(400, "Refresh token is required"));
   res.status(400).json({status: false, message: "Refresh token is required" });
  }
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user) {
  //return next(errorHandler(404, "User not found"));
  res.status(404).json({status: false, message: "User not found" });
    }
    if (user.refreshToken !== refreshToken) {
      //return next(errorHandler(401, "Invalid refresh token"));
      res.status(401).json({status: false, message: "Invalid refresh token" });
    }
    const { accessToken } = generateToken(user);
 
    return res.status(200).json({
      status: true,
      message: "Access token refreshed successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    //return next(errorHandler(401, "Invalid or expiredrefresh token"));
    res.status(401).json({status: false, message: "Invalid or expired refresh token" });
  }
};
 

// register User
export const registerUser = async (req,res) =>{
    const { name ,email,password } = req.body;
    if(!(name || email || password )) {
         res.status(400).json({status: false, message: "All fields are required" });
       
    }
   
    try {
    const existUser = await User.findOne({ email });
    if(existUser){
        return res.status(409)
        .json({ status: false, message: "user already exists."});
        
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const ProfileImage = req.files? req.files["ProfileImage"][0].path: null
    const videoUploads = req.files? req.files["videoUploads"][0].path: null
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        ProfileImage,
        videoUploads,
        });
        await newUser.save();

       
    const user = await User.findById(newUser.id).select('-password')
    res.status(200).json({status:true, message:"user register successfully",
    newUser:{name:user.name,email:user.email,ProfileImage:user.ProfileImage,videoUploads:user.videoUploads}
    
  })
     
   } catch (error) {
    return res.status(500).json({message:"Internal server error" , error: error.message || error}) 
   }
};

// login User

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate the tokens
    // const { accessToken, refreshToken } = await generateToken(user._id);
    const {accessToken, refreshToken} = generateToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    // Send the tokens as cookies and the response
    return res
      .status(200)
      // .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' })
      // .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' })
      .json({
        status: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    console.error("Login error:", error); // Add console logging for debugging
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//Get User by Id
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }
    return res.status(200).json({ status: true, message: "User fetched successfully.", user });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

//logout User

export const logoutUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
     // next(errorHandler(404, "User not found"));
     res.status(404).json({status: false, message: "User not found" });
    }
    user.refreshToken = null;
    await user.save();
 
    return res
      .status(200)
      .json({ status: true, message: "User logged out successfully." });
  } catch (error) {
    //next(error);
    res.status(500).json({status: false, message: "Internal server error" });
  }
};


 //Update User
  export const updateUser = async (req, res) => {
    const { name, email, password } = req.body;
   
    if (!(name || email || password)) {
     
      res.status(400).json({message:"At least one field (name, email, or password) is required"})
    }
   
    try {
      const userId = req.params.id
      const user = await User.findOne({_id:userId});
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
        
      }
   
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res
            .status(409)
            .json({ status: false, message: "Email already in use." });
        
        }
      }
   
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
   
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();

      const token = generateToken(user);

       return res
        .status(200)
        .json({ status: true, message: "User updated successfully.",token});
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error", error });
     
    }
  };
  
  //Delete User
  export const deleteUser = async (req, res,next) => {
  
   
    try {
        const userId = req.params.id
        const user = await User.findOne({_id:userId});
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
        
      }
     
      await User.findByIdAndDelete(userId)
      return res
        .status(200)
        .json({ status: true, message: "User deleted successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error", error });
      
    }
  };
   
 //Get All Users
  export const getAllUser = async (req, res, next) => {
    try {
      
      const users = await User.find();
      
      
      if (users.length === 0) {
        return res.status(404).json({ status: false, message: "No users found." });
        
      }
   
      
      return res.status(200).json({ status: true, message: "Users fetched successfully.", users });
    } catch (error) {
      return res.status(500).json({ status: false, message: "Internal server error", error: error.message });
      
    }
  };
  
  