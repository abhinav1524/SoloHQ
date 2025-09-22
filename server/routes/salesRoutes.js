// routes/salesRoutes.js
const express =require( "express");
const getSalesData =require("../controllers/salesController.js");
const {protect} = require("../middleware/authMiddleware.js");
const router = express.Router();
router.get("/",protect, getSalesData);

module.exports= router;
