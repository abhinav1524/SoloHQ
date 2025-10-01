const Payment = require("../models/Payments");
const User = require("../models/Users");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { userId, subscriptionPlan, price,features,durationInMonths } = req.body;

    const options = {
      amount: price * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {

        planName: subscriptionPlan,
        features: JSON.stringify(features) // optional, just metadata
      }
    };

    const order = await razorpay.orders.create(options);

    // Save order in DB
    const payment = new Payment({
      user: userId,
      subscriptionPlan,
      razorpayOrderId: order.id,
      price,
      features: features,
      durationInMonths:durationInMonths,
      status: "pending",
    });

    await payment.save();

    res.json({ success: true, order, paymentId: payment._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};
// Verify payment and calculate subscription expiry

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 1️⃣ Verify Razorpay signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // 2️⃣ Find payment record
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // 3️⃣ Calculate expiry safely
    const now = new Date();
    const durationMonths = payment.durationInMonths || 1; // default 1 month if missing
    const baseDate = payment.expiresAt && payment.expiresAt > now ? payment.expiresAt : now;
    const expiresAt = new Date(baseDate.getTime()); // clone date
    expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

    // 4️⃣ Update payment record
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "success";
    payment.expiresAt = expiresAt;
    await payment.save();

    // 5️⃣ Update user subscription
    const user = await User.findById(payment.user);
    user.subscription = {
      planName: payment.planName,
      price: payment.price,
      durationInMonths: durationMonths,
      features: payment.features,
      startDate: now,
      endDate: expiresAt,
      status: "active",
    };
    await user.save();

    res.json({
      success: true,
      payment,
      subscription: user.subscription,
      message: `Subscription active until ${expiresAt.toDateString()}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};

