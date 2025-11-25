const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movie',
    required: true
  },
  showTime: {
    type: String,
    required: true
  },
  showDate: {
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
  pricing: {
    vip: { type: Number, default: 100000 },      
    standard: { type: Number, default: 65000 }   
  },
  seatLayout: {
    rows: [{
      rowId: String,        // 'A', 'B', 'C'...
      rowLabel: String,
      seatType: {           // 'VIP' hoặc 'STANDARD'
        type: String,
        enum: ['VIP', 'STANDARD'],
        default: 'STANDARD'
      },
      seats: [{
        seatId: String,     // 'A1', 'A2'...
        number: Number,
        isAisle: { type: Boolean, default: false }  // true = lối đi (null)
      }]
    }]
  },
  seatStatus: [{
    seatId: String,                    // 'A1', 'B5'...
    status: {
      type: String,
      enum: ['available', 'selected', 'booked'],
      default: 'available'
    },
    lockedBy: String,                  // sessionId của user đang giữ ghế
    lockedUntil: Date,                 // Thời gian hết hạn lock (5 phút)
    bookingId: {                       // ID của booking nếu đã xác nhận
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  }]
});

showSchema.index({ movieId: 1, showDate: 1, showTime: 1 });
showSchema.index({ 'seatStatus.seatId': 1 });
module.exports = mongoose.model('Show', showSchema);
