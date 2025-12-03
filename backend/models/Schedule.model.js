const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movies',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
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
  pending_seats:[{  
    type: String
  }]
}, {
  timestamps: true
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
