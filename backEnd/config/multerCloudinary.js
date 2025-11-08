import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "watch_catalog",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
    transformation: [
      {
        width: 1000,
        height: 1000,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
    eager_async: true,
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Invalid file type. Only JPG, PNG, WEBP allowed!"), false);
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
