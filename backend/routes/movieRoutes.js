const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieControllers');


router.get('/', MovieController.getNowPlayingMovie);
router.post('/', MovieController.createMovie);
// router.get('/:id', MovieController.getMovieDetail);

router.get('/fetchData', MovieController.fetchAllNowPlayingMovie);

// router.get('/', (req, res) => {
//         res.json({ message: "Route cinema OK" });
// });

module.exports = router;