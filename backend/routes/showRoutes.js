const express = require("express");
const router = express.Router();
const ShowController = require("../controllers/ShowController");

router.post("/add", ShowController.addShow);

module.exports = router;