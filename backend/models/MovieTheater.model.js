const mongoose = require("mongoose");

const movieTheaterSchema = new mongoose.Schema({
    name: String,
    address: String,
    hallCount: Number,
}, {
    timestamps: true
})

const MovieTheater = mongoose.model("MovieTheater", movieTheaterSchema);
module.exports = MovieTheater