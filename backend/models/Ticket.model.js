const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true
  },
  userId: {
    type: String, // Tạm thời để String vì chưa có Model User
    default: "guest_user" 
  },
  seatNames: [{
    type: String,
    required: true
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'], // pending: chờ thanh toán, paid: đã xong
    default: 'pending'
  },
  expireAt: {
    type: Date, // Thời điểm vé tự hủy nếu không thanh toán
    required: true
  }
}, {
  timestamps: true
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;