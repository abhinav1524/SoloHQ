// controllers/salesController.js
const Order = require("../models/Order");

const getSalesData = async (req, res) => {
  try {
    console.log(req.user._id)
    const { filter } = req.query;

   const today = new Date();
let startDate;
if (filter === "daily") {
  startDate = new Date(today);
  console.log(startDate)
  startDate.setHours(0, 0, 0, 0);
} else if (filter === "weekly") {
  startDate = new Date();
  startDate.setDate(today.getDate() - 7);
} else {
  startDate = new Date();
  startDate.setMonth(today.getMonth() - 1);
}

    // ✅ Filter by logged-in user
    const orders = await Order.find({
      userId: req.user._id,
      date: { $gte: startDate },
    })
      .populate("productId")
      console.log(orders);

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
    const unitsSold = orders.reduce((sum, o) => sum + o.quantity, 0);

    const productCount = {};
    orders.forEach((o) => {
      const productName = o.productId?.name || "Unknown";
      productCount[productName] = (productCount[productName] || 0) + o.quantity;
    });

    const bestSeller = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];

    res.json({
      totalRevenue,
      unitsSold,
      avgOrderValue: orders.length ? (totalRevenue / orders.length).toFixed(2) : 0,
      bestSeller: bestSeller ? { name: bestSeller[0], units: bestSeller[1] } : null,
      salesTrend: orders.map((o) => ({
        date: o.createdAt.toISOString().split("T")[0],
        revenue: o.price * o.quantity,
      })),
      productBreakdown: Object.entries(productCount).map(([name, value]) => ({
        name,
        value,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching sales data" });
  }
};


module.exports=getSalesData;