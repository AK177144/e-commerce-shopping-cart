const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder} = require("../controllers/orderController");

const { admin } = require("../middleware/adminMiddleware");

router.route("/").post(protect, createOrder).get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/status").put(protect, admin, updateOrderStatus);
router.route("/:id/cancel").put(protect, cancelOrder);

module.exports = router;
