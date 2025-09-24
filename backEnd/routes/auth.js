import express from "express";
import { signup, login, profile, admin } from "../controllers/authController.js";
import {authMiddleware, adminMiddleware} from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.get("/admin", authMiddleware,adminMiddleware, admin);


export default router;