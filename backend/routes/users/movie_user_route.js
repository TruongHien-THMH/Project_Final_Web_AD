const express = require('express');
const router = express.Router();


const sliderServices = require('../../controllers/Services/SliderServices'); 


const movieServices = require('../../controllers/Services/movieServices');



router.get('/slider', sliderServices.getSliderMovies);

router.get('/', movieServices.getMovieList);
router.get("/movie/:id", movieServices.getMovieDetail);
router.get("/movie/db/:id", movieServices.getMovieBackUp);

module.exports = router;