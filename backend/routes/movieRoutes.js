const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/Admin/movie_admin_controller');

router.get('/', MovieController.getNowPlayingMovie);
router.post('/', MovieController.createMovie);

router.get("/movie/:id", MovieController.getMovieDetail);

router.get('/fetchData', MovieController.fetchAllNowPlayingMovie);

module.exports = router;