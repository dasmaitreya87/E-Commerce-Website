// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"; // you must have this model
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

const currency = 'inr';
const deliveryCharge = 10;

// initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || typeof amount === 'undefined' || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const orderData = {
      userId,
      items,
      amount: Number(amount),
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // clear user's cart — adjust property name to match your user schema
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(201).json({ success: true, message: "Order placed (COD)", orderId: newOrder._id });
  } catch (error) {
    console.error("placeOrder error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    // get origin to build success/cancel urls
    const origin = req.headers.origin || process.env.FRONTEND_URL || '';

    if (!userId || !items || typeof amount === 'undefined' || !address) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const orderData = {
      userId,
      items,
      address,
      amount: Number(amount),
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // build line items for Stripe
    const line_items = (items || []).map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name || 'Product'
        },
        // ensure unit_amount is integer (amount in smallest currency unit)
        unit_amount: Math.round(Number(item.price || 0) * 100)
      },
      quantity: Math.max(1, parseInt(item.quantity || 1, 10))
    }));

    // add delivery charge as a separate line
    line_items.push({
      price_data: {
        currency: currency,
        product_data: { name: 'Delivery Charges' },
        unit_amount: Math.round(Number(deliveryCharge) * 100)
      },
      quantity: 1
    });

    const success_url = `${origin}/verify?success=true&orderId=${newOrder._id}`;
    const cancel_url = `${origin}/verify?success=false&orderId=${newOrder._id}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url,
      cancel_url,
      metadata: {
        orderId: newOrder._id.toString(),
      }
    });

    // return session url for frontend to redirect to
    return res.status(200).json({ success: true, session_url: session.url });

  } catch (error) {
    console.error('placeOrderStripe error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    if (!userId || !items || typeof amount === 'undefined' || !address) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const orderData = {
      userId,
      items,
      address,
      amount: Number(amount),
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now()
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Razorpay expects amount in paise (integer)
    const amountPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountPaise,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString()
    };

    // create Razorpay order (promise)
    const razorpayOrder = await razorpayInstance.orders.create(options);

    // return razorpay order + our order id + public key id (frontend needs key_id)
    return res.json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder._id,
      razorpayKey: process.env.RAZORPAY_KEY_ID || null
    });

  } catch (error) {
    console.log('placeOrderRazorpay error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay payment (server-side signature check)
const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId, // our order (mongoose) id / receipt
      userId
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // signature valid -> update payment status and clear cart
    await orderModel.findByIdAndUpdate(orderId, {
      payment: true,
      paymentDetails: {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      }
    });

    if (userId) {
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
    }

    return res.json({ success: true, message: 'Payment verified and order updated' });

  } catch (error) {
    console.error('verifyRazorpay error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// All orders data (Admin Panel)
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    // require admin boolean true
    if (!req.user || req.user.isAdmin !== true) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { id, status } = req.body;
    if (!id || typeof status === "undefined") {
      return res.status(400).json({ success: false, message: "Missing order id or status" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("updateStatus error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  verifyStripe,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyRazorpay
};
