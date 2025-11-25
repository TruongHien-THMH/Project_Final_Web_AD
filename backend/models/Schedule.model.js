const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  movieId: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        required: true
    }
  ,
  time: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  cinemaHall: {
    type: Number,
    required: true
  },
  price: {
    vip: { type: Number, default: 100000 },      
    standard: { type: Number, default: 65000 }   
  }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
console.log(Schedule.schema.path("movieId").options.ref);

module.exports = Schedule;
