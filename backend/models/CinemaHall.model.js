const mongoose = require('mongoose');

const cinemaHallsSchema = new mongoose.Schema({
    theater_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MovieTheater",
        require: true
    },
    name: String
})

const CinemaHall = mongoose.model("CinemaHall", cinemaHallsSchema)
module.exports = CinemaHall