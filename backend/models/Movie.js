const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  obj_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  id: { type: Number, required: true },
  title: {type: String} ,
  original_title: { type: String },
  overview: { type: String },
  poster_path: { type: String },
  release_date: { type: String },
  genre_ids: { type: [Number] }
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;