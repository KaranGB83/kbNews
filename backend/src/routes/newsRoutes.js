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

const router = express.Router();

router.use(rateLimiter);

// public routes
router.get("/", getAllNews);
router.get("/:id", getNewsById);

// protected routes — must be logged in
router.post("/", verifyToken, createNews);
router.put("/:id", verifyToken, updateNews);
router.delete("/:id", verifyToken, deleteNews);

export default router;