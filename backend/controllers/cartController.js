import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check the user ID and try again.",
      });
    }

    let cartData = userData.cartData || {};
    
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the item to the cart. Please try again later.",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check the user ID and try again.",
      });
    }

    let cartData = userData.cartData || {};

    if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while removing the item from the cart. Please try again later.",
    });
  }
};

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check the user ID and try again.",
      });
    }

    let cartData = userData.cartData || {};
    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.error("Error fetching user cart data:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the cart data. Please try again later.",
    });
  }
};

export { addToCart, removeFromCart, getCart };
