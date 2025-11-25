const mongoose = require("mongoose");

const genreschema = new mongoose.Schema({
    id: Number,
    name: String
})

const Genres = mongoose.model("Genres", genreschema)

module.exports = Genres;
