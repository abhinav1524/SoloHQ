const express = require("express");
const {
  getCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/campaignController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

router.get("/", getCampaigns);
router.post("/", addCampaign);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

module.exports = router;
