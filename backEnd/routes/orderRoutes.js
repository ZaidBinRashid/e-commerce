import express from "express";
import { createOrder } from "../controllers/checkoutController.js";


const orderRoutes = express.Router();

//------------------- CheckOut Routes ---------------
orderRoutes.post("/create", createOrder)

export default orderRoutes