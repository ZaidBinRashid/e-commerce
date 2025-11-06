import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "watch_catalog",
      format: "jpg",
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Invalid file type. Only JPG, PNG allowed!"), false);
    } else {
      cb(null, true);
    }
  },
}).fields([
  { name: "images", maxCount: 10 },
  { name: "colorImages", maxCount: 10 },
  { name: "backImages", maxCount: 10 },
  { name: "wristImages", maxCount: 10 },
]);

export default upload;
