const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/Admin/MovieControllers');

router.get('/', MovieController.getNowPlayingMovie);
router.post('/', MovieController.createMovie);
router.get('/fetchData', MovieController.fetchAllNowPlayingMovie);

module.exports = router;