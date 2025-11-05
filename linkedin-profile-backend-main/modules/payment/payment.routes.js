import express from "express";
import {createOrderController,verifyPaymentController,} from "./payment.controller.js";
import authMiddleware from "../auth/src/middlewares/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", authMiddleware, createOrderController);
paymentRouter.post("/verify-payment", authMiddleware, verifyPaymentController);

export default paymentRouter;