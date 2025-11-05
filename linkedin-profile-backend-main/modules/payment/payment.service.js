import crypto from "crypto";
import { razorpayInstance } from "../../utils/razorpay.js";

export const createOrder = async (amount, currency = "INR") => {
  const options = {
    amount: amount * 100, 
    currency,
    receipt: `receipt_${Date.now()}`,
  };
  return await razorpayInstance.orders.create(options);
};

export const verifyPayment = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
};
