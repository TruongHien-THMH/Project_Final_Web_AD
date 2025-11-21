const express = require('express');
const router = express.Router();
const ShowController = require("../controllers/Admin/ShowController");

router.post('/', ShowController.addShow);
router.get('/', ShowController.getAllShows); 
router.delete('/:id', ShowController.deleteShow); 

router.post('/seed/:movieId', ShowController.seedShows);


module.exports = router;