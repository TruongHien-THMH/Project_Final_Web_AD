const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: {type: String} ,
  original_title: { type: String },
  overview: { type: String },
  poster_path: { type: String },
  popularity: {type: Number},
  vote_average: {type: Number},
  release_date: { type: String },
  genre_ids: { type: [Number] }
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;