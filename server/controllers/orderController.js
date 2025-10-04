const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendWhatsAppMessage } = require("../services/whatsappService");
const { sendNotification } = require("../utils/notifications");

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
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("customerId", "name phone email") // populate customer details
      .populate("productId", "name price");
    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      date: formatDate(order.date),
    }));

    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// GET all orders (with optional status filter)
const getFilterOrders = async (req, res) => {
  try {
    const { status } = req.query; // get status from query string
        // 1️⃣ Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (!status) {
      return res
        .status(400)
        .json({ message: "Status query parameter is required" });
    }

    // Fetch orders matching the status
    const orders = await Order.find({userId: req.user._id, status: status })
    .sort({createdAt:-1})
    .populate("customerId","name phone email")
    .populate("productId","name price")
    .lean();
    ;

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: `No orders found with status: ${status}` });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Add new order
const addOrder = async (req, res) => {
  try {
    // console.log(req);
    let { customerId, productId, quantity, price, status, date, notes } =
      req.body;

    if (date && date.includes("/")) {
      const [day, month, year] = date.split("/");
      date = new Date(`${year}-${month}-${day}`);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // 2️⃣ Check if enough stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let order = await Order.create({
      userId: req.user._id,
      customerId,
      productId,
      quantity,
      price,
      status: status || "pending",
      date,
      notes,
    });
    // 4️⃣ Reduce product stock
    product.stock -= quantity;
    await product.save();

    order = await order.populate([
      { path: "customerId", select: "name phone email" },
      { path: "productId", select: "name price" },
      { path: "userId", select: "name phone" },
    ]);

    // Send WhatsApp alert only if feature is allowed
    if (!req.featureRestricted && order.customerId.phone) {
      await sendWhatsAppMessage(
        `+91${order.customerId.phone}`,
        `Hi ${order.customerId.name}, your order 📦 ${order.productId.name} whose orderid is #${order._id} has been placed successfully!`
      );
    }

    // 7️⃣ WhatsApp alert to user if stock is running low
    if (product.stock <= 5 && order.userId?.phone) {
      await sendWhatsAppMessage(
        `+91${order.userId.phone}`,
        product.stock === 0
          ? `🚨 Hi ${order.userId.name}, "${product.name}" is OUT OF STOCK! Please restock immediately.`
          : `⚠️ Hi ${order.userId.name}, stock for "${product.name}" is running low. Only ${product.stock} left!`
      );
    }

    // sending the pending order notification
    await sendNotification(
      req.user._id,
      `You have a new pending order #${order._id}`,
      "order",
      req
    );
    // format date before sending response
    res.status(201).json({
      ...order.toObject(),
      date: formatDate(order.date),
      featureMessage: req.featureRestricted ? req.featureMessage : null,
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
    const orderId = req.params.id;
    let { productId, quantity, price, status, date, notes } = req.body;

    if (date && date.includes("/")) {
      const [day, month, year] = date.split("/");
      date = new Date(`${year}-${month}-${day}`);
    }

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.productId = productId !== undefined ? productId : order.productId;
    order.quantity = quantity !== undefined ? quantity : order.quantity;
    order.price = price !== undefined ? price : order.price;
    order.status = status !== undefined ? status : order.status;
    order.date = date !== undefined ? date : order.date;
    order.notes = notes !== undefined ? notes : order.notes;

    await order.save();

    if (order.customerId?.phone) {
      await sendWhatsAppMessage(
        order.customerId.phone,
        `✅ Hi ${order.customerId.name}, your order #${order._id} status has been updated to *${order.status}*`
      );
    }
    // ✅ Populate customer info
    await order.populate("customerId");
    await order.populate("productId", "name price");
    res.status(200).json({
      ...order.toObject(),
      date: formatDate(order.date),
    });
  } catch (error) {
    console.error("Order update error:", error);
    res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Order deletion error:", error);
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
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

// calculating today sale

const getTodaySale = async (req, res) => {
  const userId = req.user._id;

  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
  );
  const endOfDay = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );

  const todayOrders = await Order.find({
    customerId: userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // ✅ use createdAt instead of custom "date"
  });

  const totalSale = todayOrders.reduce(
    (sum, order) => sum + order.quantity * (order.price || 0),
    0
  );

  res.json({ totalSale, orderCount: todayOrders.length });
};

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getFilterOrders,
  getTodaySale,
};
