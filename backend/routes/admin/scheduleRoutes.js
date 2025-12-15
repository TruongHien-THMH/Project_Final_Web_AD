const express = require('express');
const router = express.Router();
const scheduleCtl = require("../../controllers/Admin/schedule_admin_controller");

router.post('/auto-generate', scheduleCtl.autoGenerateSchedules);

router.get('/seatbooking/:id', scheduleCtl.showSeatBooked);

router.get('/:id', scheduleCtl.getSchedule);


module.exports = router;