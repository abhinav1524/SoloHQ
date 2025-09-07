const Order = require("../models/Order");
const Customer = require("../models/Customer");
const {sendWhatsAppMessage} = require("../services/whatsappService");

// format date
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("customerId", "name phone email"); // populate customer details

    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      date: formatDate(order.date),
    }));

    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Add new order
const addOrder = async (req, res) => {
  try {
    let { customerId, product, quantity, status, date, notes } = req.body;

    if (date && date.includes("/")) {
      const [day, month, year] = date.split("/");
      date = new Date(`${year}-${month}-${day}`);
    }

    const order = await Order.create({
      customerId,
      product,
      quantity,
      status: status || "pending",
      date,
      notes,
    });

    // Find customer to get details for WhatsApp notification
    const customer = await Customer.findById(customerId);

    if (customer && customer.phone) {
      await sendWhatsAppMessage(
        customer.phone,
        `📦 Hi ${customer.name}, your order for ${quantity} x ${product} has been placed successfully!`
      );
    }

    // format date before sending response
    res.status(201).json({
      ...order.toObject(),
      date: formatDate(order.date),
    });
  } catch (error) {
    console.error("Order creation error:", error); // 👈 this will show the reason
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// Update Order
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    let { product, quantity, status, date, notes } = req.body;

    if (date && date.includes("/")) {
      const [day, month, year] = date.split("/");
      date = new Date(`${year}-${month}-${day}`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.product = product !== undefined ? product : order.product;
    order.quantity = quantity !== undefined ? quantity : order.quantity;
    order.status = status !== undefined ? status : order.status;
    order.date = date !== undefined ? date : order.date;
    order.notes = notes !== undefined ? notes : order.notes;

    await order.save();

    // Send WhatsApp notification on update (optional)
    const customer = await Customer.findById(order.customerId);
    if (customer && customer.phone) {
      await sendWhatsAppMessage(
        customer.phone,
        `📦 Hi ${customer.name}, your order for ${order.quantity} x ${order.product} has been updated. Status: ${order.status}`
      );
    }

    res.status(200).json({
      ...order.toObject(),
      date: formatDate(order.date),
    });
  } catch (error) {
    console.error("Order update error:", error);
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Order deletion error:", error);
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};


// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer",
      "name phone"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    await order.save();

    // Optional WhatsApp notification on status update
    if (order.customer && order.customer.phone) {
      await sendWhatsAppMessage(
        order.customer.phone,
        `✅ Hi ${order.customer.name}, your order #${order._id} status has been updated to *${order.status}*.`
      );
    }

    res.json({
      ...order.toObject(),
      date: formatDate(order.date),
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

module.exports = { getOrders, addOrder,updateOrder,deleteOrder,updateOrderStatus };
