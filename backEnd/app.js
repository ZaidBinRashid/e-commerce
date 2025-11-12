import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/router.js";
import paymentRoutes from "./routes/paymentRoutes.js"
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();


// Creating an App.
const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(cors({ origin:process.env.CORS_ORIGIN,credentials: true }));
app.use(bodyParser.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/payment",paymentRoutes);

export default app;
