import express from "express";
import { signup, login, profile, logout} from "../controllers/userController.js";
import { upload, addProduct, getProductById, deleteProduct, allProducts, updateProduct} from "../controllers/productController.js";
import { addTestimonials, testimonials, deleteTestimonial } from "../controllers/testimonials.js";
import {authMiddleware, adminMiddleware} from "../middleware/authMiddleware.js";



const router = express.Router();

//----------- User Routes ----------
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile/:id", authMiddleware, profile);

//----------- Product Routes ----------
router.get("/allProducts", allProducts)
router.post("/addProduct", authMiddleware,adminMiddleware,upload,addProduct);
router.get("/product/:id", getProductById);
router.delete("/product/:id", authMiddleware,adminMiddleware, deleteProduct)
router.put("/product/:id", authMiddleware,adminMiddleware, upload, updateProduct)

//----------- Testimonials Routes ----------
router.post("/addTestimonials",addTestimonials)
router.get("/testimonials", testimonials)
router.delete('/testimonial/:id', deleteTestimonial)

export default router