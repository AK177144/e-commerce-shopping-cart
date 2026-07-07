const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @desc    Create Order
// @route   POST /api/orders
// @access  Private

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Find user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Create Order

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a complete shipping address",
      });
    }
    const order = await Order.create({
      user: req.user._id,

      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),

      shippingAddress,

      paymentMethod,

      totalAmount: cart.totalPrice,
    });

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Logged-in User Orders
// @route   GET /api/orders
// @access  Private

const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user._id
        })
        .populate("items.product")
        .sort({ createdAt: -1 });

        const totalSpent = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0,
        );

        res.status(200).json({
          success: true,
          summary: {
            totalOrders: orders.length,
            totalSpent,
          },
          data: orders,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const mongoose = require("mongoose");

// @desc    Get Single Order
// @route   GET /api/orders/:id
// @access  Private

const getOrderById = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Ensure users can only access their own orders
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Order Status
// @route   PUT /api/orders/:id/status
// @access  Admin

const updateOrderStatus = async (req, res) => {

    try {

        const { orderStatus } = req.body;

        const validStatuses = [
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.orderStatus = orderStatus;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// @desc    Cancel Order
// @route   PUT /api/orders/:id/cancel
// @access  Private

const cancelOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Only the owner can cancel
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Cannot cancel after shipping
        if (
            order.orderStatus === "Shipped" ||
            order.orderStatus === "Delivered"
        ) {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled after shipping"
            });
        }

        // Already cancelled
        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            });
        }

        order.orderStatus = "Cancelled";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
