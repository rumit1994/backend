import express from "express";
import {registerUser,loginUser,logoutUser,updateUser,deleteUser,getUser,getAllUser,refreshUserToken} from "../controller/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/Auth.js";
 
const route = express.Router();
 
route.post("/register",upload.fields([
    {
        name:"ProfileImage",
        maxCount:1
    },
    {
        name:"videoUploads",
        maxCount:1
    }
]), registerUser);
route.post("/login", loginUser);
route.post("/logout/:id",logoutUser);
route.put("/update/:id",updateUser);
route.delete("/delete/:id",deleteUser);
route.get("/get",getAllUser);
route.get("/get/:id",getUser);
route.post("/refresh_token",refreshUserToken);

export default route;
 

