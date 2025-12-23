const express = require("express");
const router = express.Router();
const schedulesCtl = require("../../controllers/Admin/schedule_admin_controller");

router.get("/:id", schedulesCtl.getSchedule);
router.get("/seatbooking/:id", schedulesCtl.showSeatBooked);

module.exports = router