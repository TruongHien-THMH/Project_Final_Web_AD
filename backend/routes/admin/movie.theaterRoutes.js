const express = require("express");
const router = express.Router();
const movie_theaterCtl = require("../../controllers/Admin/movie.theater_admin_controller");

router.get('/', movie_theaterCtl.getTheaters);
router.get('/rooms', movie_theaterCtl.getRooms);

router.post('/create_theater',movie_theaterCtl.createTheater);

router.put('/edit/:id', movie_theaterCtl.edit);

router.delete('/delete/:id', movie_theaterCtl.delete);

module.exports = router