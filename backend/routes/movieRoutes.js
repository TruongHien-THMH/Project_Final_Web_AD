const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieControllers');

router.get('/', MovieController.getNowPlayingMovie);

module.exports = router;