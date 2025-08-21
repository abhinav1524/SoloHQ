const Order = require("../models/Order");
const {sendWhatsappMessage} =require("../services/whatsappService");
const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

const addOrder = async (req, res) => {
  const { products } = req.body;
  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const order = await Order.create({ user: req.user._id, products, totalPrice });
  await sendWhatsappMessage(
      req.user.phone, 
      `📦 Hi ${req.user.name}, your order #${order._id} has been placed successfully!`
    );// sending whatsapp message
  res.status(201).json(order);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  order.status = req.body.status;
  await order.save();
  res.json(order);
};

module.exports = { getOrders, addOrder, updateOrderStatus };
