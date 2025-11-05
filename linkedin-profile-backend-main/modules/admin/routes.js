import { Router } from "express";
import { 
  adminLogin,
  createAdmin,
  getAdminProfile,
  getDashboardStats,
  getUsers,
  getUserDetail,
  blockUser,
  getAgents,
  getAgentPerformance,
  createAgent,
  getRevenueAnalytics,
  getSubscribedUsers,
  getCoupons,
  createCoupon,
  getCertifications,
  reviewCertification, 
  adminLogout,
  updateAdminPassword,    
  resetAdminPassword,     
  hashExistingPasswords, 
  validateReferralCode,
  regenerateReferralCode,
  toggleReferralCodeStatus
} from "./controllers.js";
import { authenticateToken, requireSuperAdmin, requireAnyAdmin} from "./middleware.js";

const router = Router();

// Auth routes
router.post("/login", adminLogin);
router.post("/logout", adminLogout);
// Public (no auth required)
router.post('/validate-referral', validateReferralCode);

router.post("/admins", authenticateToken, requireSuperAdmin, createAdmin);
router.get("/profile", authenticateToken, getAdminProfile);
router.patch("/password", authenticateToken, updateAdminPassword); // Update own password
router.patch("/password/reset", authenticateToken, requireSuperAdmin, resetAdminPassword); // Reset other admin's password
router.post("/password/migrate", authenticateToken, requireSuperAdmin, hashExistingPasswords); // Migrate existing passwords

// Dashboard & Analytics
router.get("/dashboard", authenticateToken, requireAnyAdmin, getDashboardStats);
router.get("/analytics/revenue", authenticateToken, requireAnyAdmin, getRevenueAnalytics);

// User Management
router.get("/users", authenticateToken, requireAnyAdmin, getUsers);
router.get("/users/:id", authenticateToken, requireAnyAdmin, getUserDetail);
router.patch("/users/:id/block", authenticateToken, requireAnyAdmin, blockUser)

// Agent Management
router.get("/agents", authenticateToken, requireAnyAdmin, getAgents);
router.get("/agents/:id/performance", authenticateToken, requireAnyAdmin, getAgentPerformance);
router.post("/agents", authenticateToken, requireAnyAdmin, createAgent);
// Protected (admin only)
router.post('/agents/:id/regenerate-code', regenerateReferralCode);
router.post('/agents/:id/toggle-code', toggleReferralCodeStatus);

// Subscription Management
router.get("/subscribed", authenticateToken, requireAnyAdmin, getSubscribedUsers);

// Coupon Management
router.get("/coupons", authenticateToken, requireAnyAdmin, getCoupons);
router.post("/coupons", authenticateToken, requireSuperAdmin, createCoupon);

// Certification Management
router.get("/certifications", authenticateToken, requireAnyAdmin, getCertifications);
router.patch("/certifications/:id/review", authenticateToken, requireAnyAdmin, reviewCertification);

export default router;