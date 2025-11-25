const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: {type: String} ,
  original_title: { type: String },
  overview: { type: String },
  poster_path: { type: String },
  release_date: { type: String },
  genre_ids: {
    type: [Number]
  },
  genres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genres"
  }]
});
const Movies = mongoose.model("Movies", movieSchema);
// Dùng để check model nào. 
// Đã check
// console.log(Movies.collection.name);  
// Check ref đúng chưa
// Đã check
// console.log(Movies.schema.path("genre_ids").options.ref);

module.exports = Movies;