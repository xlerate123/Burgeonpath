import { Router } from "express";
import authMiddleware from "../auth/src/middlewares/authMiddleware.js";
import {
  createProfileController,
  getProfileController,
  updateProfileController,
  deleteProfileController
} from "./controllers/profileController.js";

import { upload, analyzeProfileController, chatModifyController } from "./controllers/analyzerController.js";

const router = Router();

router.post("/", authMiddleware, createProfileController);
router.get("/", authMiddleware, getProfileController);
router.put("/", authMiddleware, updateProfileController);
router.delete("/", authMiddleware, deleteProfileController);

router.post("/analyze-profile", authMiddleware, upload.single("resume"), analyzeProfileController);
router.post("/chat-modify", authMiddleware, chatModifyController);

export default router;
