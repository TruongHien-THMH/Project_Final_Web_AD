const express = require('express');
const router = express.Router();
const movieServices = require('../../controllers/Services/movieServices');

router.get('/', movieServices.getMovieList);
router.get("/movie/:id", movieServices.getMovieDetail);

module.exports = router;