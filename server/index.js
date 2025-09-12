require("dotenv").config();
require("./config/passport");
const http= require("http");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { Server } = require("socket.io");
const app = express();
connectDB();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());//cookie
app.use(passport.initialize()); // passport intialize

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible in routes/controllers
app.set("io", io);
// Socket.io setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join room for user-specific notifications
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/inventory", require("./routes/productRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
