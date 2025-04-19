import express from "express";
import { handleImages } from "../middleware/handleImages";
import { generateImage } from "../controllers/main-controllers";

const router = express.Router();

const uploadedImages = handleImages.fields([
    { name: "selfImage", maxCount: 1 },
    { name: "modelImage", maxCount: 1 }
])

router.post("/", uploadedImages, generateImage)

export default router;