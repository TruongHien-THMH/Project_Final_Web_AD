const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieControllers');

// router.get('/', MovieController.getNowPlayingMovie);
router.get('/', (req, res) => {
        res.json({ message: "Route cinema OK" });
});

module.exports = router;