const mongoose = require('mongoose');

const cinemaHallsSchema = new mongoose.Schema({
    roomCount: Number,
    locate: String,
    name: String
})

const CinemaHall = mongoose.Model("CinemaHall", cinemaHallsSchema)
module.exports = CinemaHall