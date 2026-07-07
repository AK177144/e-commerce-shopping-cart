const Product = require("../models/Product");

// @desc    Create Product
// @route   POST /api/products
// @access  Public (We'll make this Admin later)

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // Validation
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !image ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get All Products
// @route   GET /api/products
// @access  Public

const getProducts = async (req, res) => {
    try {

        const products = await Product.find();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
  createProduct,
  getProducts
};
