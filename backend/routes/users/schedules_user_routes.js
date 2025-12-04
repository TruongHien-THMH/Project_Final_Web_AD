const express = require("express");
const router = express.Router();
const schedulesCtl = require("../../controllers/Admin/schedule_admin_controller");

router.get("/:id", schedulesCtl.getSchedule);

module.exports = router