import express from "express";
import {
  registerWithEmail,
  handleGoogleAuth,
  completeUserProfile,
  createUserByAdmin,
  sessionLogin,
  logout
} from "../src/controllers/authController.js";
import verifyToken from "../src/middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerWithEmail);
router.post("/google", handleGoogleAuth);
router.post("/sessionLogin", sessionLogin);
router.post("/logout", logout);

// Protected routes
router.post("/complete-profile", verifyToken, completeUserProfile);
router.post("/admin/create-user", verifyToken, createUserByAdmin);

export default router;