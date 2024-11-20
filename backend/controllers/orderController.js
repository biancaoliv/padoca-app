import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while placing your order. Please try again later.",
    });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while verifying your order. Please try again later.",
    });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching orders. Please try again later.",
    });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders list:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching the orders list. Please try again later.",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the order status. Please try again later.",
    });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
