import express from "express";
import { signup, login, profile} from "../controllers/userController.js";
import { upload,addProduct, deleteProduct, allProducts, updateProduct } from "../controllers/productController.js";
import {authMiddleware, adminMiddleware} from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.get("/allProducts", allProducts)
router.post("/addProduct", authMiddleware,adminMiddleware, upload.single("image"),addProduct);
router.delete("/product/:id", authMiddleware,adminMiddleware, deleteProduct)
router.put("/product/:id", authMiddleware,adminMiddleware, upload.single("image"), updateProduct)


export default router;