const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movies',
    required: true
  },
  cinemaHall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cinemaHall",
    required: true
  },
  time_start: {
    type: Date,
    required: true
  },
  time_end: {
    type: Date,
    required: true
  },
  booked_seats: [{
    type: String
  }],
  pendding_seats:[{  
    type: String
  }]
}, {
  timestamps: true
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
