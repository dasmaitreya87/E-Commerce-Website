// routes/orderRoutes.js
import express from "express";
import {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin features
orderRouter.post("/list", adminAuth, allOrders);

// keep existing route, and add two aliases so frontend spelling mismatches won't 404
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/update-status", adminAuth, updateStatus); // hyphen variant
orderRouter.post("/updateStatus", adminAuth, updateStatus);   // camelCase variant

// Payment features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// Razorpay verification (mounted as /api/order/razorpay/verify when router is used as app.use('/api/order', ...))
orderRouter.post("/razorpay/verify", authUser, verifyRazorpay);
orderRouter.post("/razorpay/verifyPayment", authUser, verifyRazorpay); // alias if frontend uses different name

// Stripe verification (keep existing route)
orderRouter.post("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/stripe/verify", authUser, verifyStripe); // alias

// User feature
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;


