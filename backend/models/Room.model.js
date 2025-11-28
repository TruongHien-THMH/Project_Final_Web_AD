const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    cinemaHallId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CinemaHalls",
        require: true
    },
    seatRow: {
        type: String
    },
    seatCol: {
        type: Number
    }
}, {
    timestamps: true
})

const Room = mongoose.Model("Room", roomSchema);

module.exports = Room;