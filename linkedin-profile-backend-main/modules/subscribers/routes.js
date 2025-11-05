import { Router } from "express";
import { createSubscriber, listSubscribers } from "./subscriberController.js";

const router = Router();

router.post("/", createSubscriber); 
router.get("/", listSubscribers);

export default router;
