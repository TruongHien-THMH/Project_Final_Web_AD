const express = require('express');
const router = express.Router();
const movieCtl = require('../../controllers/Admin/movie_admin_controller');
const movieServices = require('../../controllers/Services/movieServices');

router.get('/', movieServices.getMovieList);
router.get("/movie/:id", movieServices.getMovieDetail);

router.post('/', movieCtl.createMovie);

router.get('/fetchData', movieCtl.fetchAllNowPlayingMovie);
router.get('/fetchGenres', movieCtl.fetchGenres);


module.exports = router;