// routes/movies.js (hoặc tên file router của bạn)

const express = require('express');
const router = express.Router();

// 1. Import Service chuyên biệt cho Slider
const sliderServices = require('../../controllers/Services/SliderServices'); 

// 2. Import Service cho các route phim chung
const movieServices = require('../../controllers/Services/movieServices');


// --- Định nghĩa các Route ---

// Route cho Slider sử dụng hàm getSliderMovies từ SliderServices
router.get('/slider', sliderServices.getSliderMovies);

// Các route cũ sử dụng movieServices
router.get('/', movieServices.getMovieList);
router.get("/movie/:id", movieServices.getMovieDetail);

module.exports = router;