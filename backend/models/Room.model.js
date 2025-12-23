const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    movie_theater_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MovieTheater",
        required: true
    },
    name: {
        type: String, // Thêm trường này
        default: "Phòng chiếu"
    },
    seatRow: {
        type: Number
    },
    seatCol: {
        type: Number
    }
}, {
    timestamps: true
})

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;