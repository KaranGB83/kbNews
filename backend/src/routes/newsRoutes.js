import express from "express";
import {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
} from "../controllers/newsController.js";
import rateLimiter from "../middleware/rateLimiter.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(rateLimiter);

router.get("/", getAllNews);
router.get("/:id", getNewsById);

router.post("/", verifyToken, upload.single("coverImage"), createNews);
router.put("/:id", verifyToken, upload.single("coverImage"), updateNews);
router.delete("/:id", verifyToken, deleteNews);

export default router;