import { verifyAccessToken } from "../jwt.js";
 
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: false, message: "Access denied. Token is required" });
  }
 
  const token = authHeader.split(" ")[1].trim();
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error: ", error);
    return res.status(401).json({ status: false, message: "Invalid Token" });
  }
};


 