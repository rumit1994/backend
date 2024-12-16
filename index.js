import express from "express";
import dotenv from "dotenv";
import connectToDB from "./db/connectDB.js";
import cors from "cors";
import route from "./routes/user.route.js";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/user", route);
const PORT = process.env.PORT || 5000;
app.use((req, res ) => {
  const error = new Error("Not Found!");
  error.status = 404;
  // console.log(error, "error");
 // next(error);
  res.status(404).json({
    success: false,
    message: error.message,
  });
});
app.use((err, req, res ) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Something went wrong in Connection", error);
  });