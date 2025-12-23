const express = require("express");
const router = express.Router();
const userController = require("../../controllers/User/user.controller");

// Tất cả các route này đều cần đăng nhập
router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateUserProfile);
router.get("/bookings", userController.getMyBookings);

module.exports = router;