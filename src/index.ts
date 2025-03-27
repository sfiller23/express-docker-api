import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import config from "./config";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = config.port;

mongoose
  .connect(config.dbUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
