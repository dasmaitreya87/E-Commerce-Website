import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { itemId, size } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Not authorized" });
    if (!itemId || size === undefined || size === null)
      return res.status(400).json({ success: false, message: "Missing itemId or size" });

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    const updatedUser = await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
    return res.json({ success: true, message: "Added to cart", cartData: updatedUser.cartData });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { itemId, size, quantity } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Not authorized" });
    if (!itemId || size === undefined || size === null || quantity === undefined)
      return res.status(400).json({ success: false, message: "Missing itemId, size or quantity" });

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};

    if (quantity <= 0) {
      // remove this size entry
      delete cartData[itemId][size];
      // if no sizes remain for the item, remove the item key
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
    return res.json({ success: true, message: "Cart updated", cartData: updatedUser.cartData });
  } catch (error) {
    console.error("updateCart error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Not authorized" });

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    return res.json({ success: true, cartData });
  } catch (error) {
    console.error("getUserCart error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
