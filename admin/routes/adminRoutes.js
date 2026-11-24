import express from "express";
import { verifyToken } from "../../backend/src/middleware/verifyToken.js";
import upload from "../../backend/src/middleware/upload.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

import { getAdminStats } from "../controllers/adminStatsController.js";
import {
  getUsers,
  createUser,
  updateUser,
  toggleVerifyUser,
  deleteUser,
} from "../controllers/adminUserController.js";
import {
  getAllNews,
  createNewsAsAdmin,
  updateNewsAsAdmin,
  deleteNewsAsAdmin,
} from "../controllers/adminNewsController.js";

const router = express.Router();

// Guard all admin routes with authentication and admin role verification
router.use(verifyToken, verifyAdmin);

// Dashboard stats
router.get("/stats", getAdminStats);

// User management endpoints
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.patch("/users/:id/verify", toggleVerifyUser);
router.delete("/users/:id", deleteUser);

// News / Article management endpoints
router.get("/news", getAllNews);
router.post("/news", upload.single("coverImage"), createNewsAsAdmin);
router.put("/news/:id", upload.single("coverImage"), updateNewsAsAdmin);
router.delete("/news/:id", deleteNewsAsAdmin);

export default router;
