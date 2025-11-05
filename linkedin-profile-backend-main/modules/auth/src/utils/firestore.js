import { admin } from "../config/firebase.js";

// Unified user schema for Firestore
const userSchema = {
  email: "",
  name: "",
  authProvider: "", // 'email_password', 'google', 'admin_created'
  googleId: null,
  phone: "",
  background: "",
  level: 1,
  quizScore: 0,
  agentId: null,
  isBlocked: false,
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const createUser = async (uid, userData) => {
  try {
    const userRef = admin.firestore().collection("users").doc(uid);
    
    // Merge with schema defaults
    const userWithDefaults = {
      ...userSchema,
      ...userData,
      updatedAt: new Date()
    };
    
    await userRef.set(userWithDefaults);
    
    // Return the created user data
    const userDoc = await userRef.get();
    return { uid, ...userDoc.data() };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUser = async (uid) => {
  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    return { uid, ...userDoc.data() };
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const updateUserProfile = async (uid, updateData) => {
  try {
    const userRef = admin.firestore().collection("users").doc(uid);
    
    await userRef.update({
      ...updateData,
      updatedAt: new Date()
    });
    
    // Return updated user data
    const userDoc = await userRef.get();
    return { uid, ...userDoc.data() };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updatePaymentStatus = async (uid, paymentData) => {
  try {
    const userRef = admin.firestore().collection("users").doc(uid);
    
    await userRef.update({
    paymentStatus: "paid",
    paymentDetails: {
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      verifiedAt: new Date().toISOString(),
    },
  });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

