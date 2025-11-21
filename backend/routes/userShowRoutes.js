const express = require('express');
const router = express.Router();
const ShowController = require('../controllers/User/showTime_user_controller');

// User booking routes
router.get('/:showId/seats', ShowController.getSeats);
router.post('/:showId/seats/select', ShowController.selectSeats);
router.post('/:showId/seats/unselect', ShowController.unselectSeats);

module.exports = router;