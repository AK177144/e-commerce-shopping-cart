const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Add Product To Cart
// @route   POST /api/cart
// @access  Private

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate request
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // Create new cart if not found
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if product already exists
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      // Increase quantity
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      // Add new item
      cart.items.push({
        product: product._id,
        quantity: quantity || 1,
        price: product.price,
      });
    }

    // Recalculate total
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get User Cart
// @route   GET /api/cart
// @access  Private

const getCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart is empty"
            });
        }

        const totalItems = cart.items.reduce((total, item) => {
          return total + item.quantity;
        }, 0);

        res.status(200).json({
          success: true,
          totalItems,
          totalPrice: cart.totalPrice,
          data: cart,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// @desc    Update Cart Quantity
// @route   PUT /api/cart/:productId
// @access  Private

const updateCartQuantity = async (req, res) => {
    try {

        const { quantity } = req.body;
        const { productId } = req.params;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        item.quantity = quantity;

        cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// @desc    Remove Product From Cart
// @route   DELETE /api/cart/:productId
// @access  Private

const removeFromCart = async (req, res) => {
    try {

        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        // Remove product
        cart.items.splice(itemIndex, 1);

        // Recalculate total price
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// @desc    Clear Cart
// @route   DELETE /api/cart
// @access  Private

const clearCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];
        cart.totalPrice = 0;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};
