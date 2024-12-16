import jwt from "jsonwebtoken";
 
//This function generates two types of tokens for a user: an access token and a refresh token.
 
export const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return { accessToken, refreshToken };
};
//This function takes the access token (as token), verifies it, and returns the decoded payload if the token is valid.
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return decoded;
  } catch (error) {
    // console.log("Access Token verification error:", error.message);
    // throw new Error("Invalid access token");
    return { status: false, message: "Invalid access token" };
  }
};
 
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return decoded;
  } catch (error) {
    //console.log("Refresh Token verification error:", error.message);
    //throw new Error("Invalid refresh token");
    return { status: false, message: "Invalid refresh token" };
  }
};