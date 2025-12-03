const express = require("express");
const router = express.Router();
const movie_theaterCtl = require("../../controllers/Admin/movie.theater_admin_controller");

router.get('/', movie_theaterCtl.getTheaters);
router.post('/create_theater',movie_theaterCtl.createTheater);

module.exports = router