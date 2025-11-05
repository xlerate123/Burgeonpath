import express from "express";
import authRoutes from "./modules/auth/src/routes.js"
import profileRoutes from "./modules/profiles/routes.js"
import subscribeRoutes from "./modules/subscribers/routes.js"
import paymentRouter from "./modules/payment/payment.routes.js";
import adminRoutes from "./modules/admin/routes.js"

const mainRouter = express.Router();

mainRouter.use("/auth", authRoutes)
mainRouter.use("/profiles", profileRoutes)
mainRouter.use("/subscribers", subscribeRoutes)
mainRouter.use("/payment", paymentRouter)

mainRouter.use("/admin", adminRoutes)

export default mainRouter; 