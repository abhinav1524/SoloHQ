const Customer = require("../models/Customer");
const Order = require("../models/Order");
const { sendWhatsappMessage } = require("../services/whatsappService");

// @desc    Add new customer
// @route   POST /api/customers
const addCustomer = async (req, res) => {
  try {
    const { name, phone,email, address, notes } = req.body;

    const customer = await Customer.create({ userId:req.user._id,name, phone, email, address, notes });
    res.status(201).json({message: "Customer added successfully! 🎉",customer});
  } catch (error) {
    res.status(500).json({ message: "Error adding customer", error });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({userId:req.user._id});
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

// get single customer
const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.json({ message: "Customer update Successfully ",customer});
  } catch (error) {
    res.status(500).json({ message: "Error updating customer", error });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
};

// @desc    Send WhatsApp message to customer
// @route   POST /api/customers/:id/message
const sendMessageToCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    await sendWhatsappMessage(customer.phone, message);

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

// @desc    Create repeat order for customer
// @route   POST /api/customers/:id/repeat-order
const repeatOrder = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // get the last order of this customer
    const lastOrder = await Order.findOne({ customerId: customer._id }).sort({ createdAt: -1 });
    if (!lastOrder) return res.status(404).json({ message: "No previous order found for this customer" });

    // allow overriding fields via req.body
    const { product, quantity, notes } = req.body;

    const order = await Order.create({
      customerId: customer._id,
      product: product || lastOrder.product,
      quantity: quantity || lastOrder.quantity,
      status: "pending",
      date: new Date(),
      notes: notes || lastOrder.notes,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Repeat Order Error:", error);
    res.status(500).json({ message: "Error creating repeat order", error });
  }
};

module.exports = {
  addCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  sendMessageToCustomer,
  repeatOrder,
};
