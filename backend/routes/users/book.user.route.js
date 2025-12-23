const express = require("express");
const router = express.Router();
const bookCtl = require("../../controllers/User/booking.user.controller");
// const { verifyToken } = require('../../middlewares/authMiddleware');

router.post("/create" ,bookCtl.createBooking);
router.post("/confirm", bookCtl.confirmPayment);

module.exports = router;