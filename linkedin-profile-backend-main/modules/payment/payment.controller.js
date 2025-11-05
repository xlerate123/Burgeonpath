import { createOrder, verifyPayment } from "./payment.service.js";
import { updatePaymentStatus } from "../auth/src/utils/firestore.js"; // ✅ Import from firestore.js
import authMiddleware from "../auth/src/middlewares/authMiddleware.js";

// ✅ Create Order Controller
export const createOrderController = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const order = await createOrder(amount, currency);
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Verify Payment + Update Firestore
export const verifyPaymentController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Ensure user is logged in
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Verify signature
    const isValid = verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // ✅ Update payment status using firestore utility
    await updatePaymentStatus(uid, {
      razorpay_order_id,
      razorpay_payment_id,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and saved successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};