import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

dotenv.config();

// Creating an App.
const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRoutes);

export default app;
