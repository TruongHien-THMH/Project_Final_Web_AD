const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // ID của TMDB
  title: { type: String, required: true },
  original_title: { type: String },
  overview: { type: String },
  
  // Hình ảnh
  poster_path: { type: String }, // Ảnh dọc (Poster)
  backdrop_path: { type: String }, // Ảnh ngang (Banner phía sau)
  
  release_date: { type: Date },
  
  // Quan trọng cho xếp lịch
  runtime: { 
      type: Number, 
      required: true, 
      default: 0 
  },
  
  vote_average: { type: Number }, // Điểm đánh giá (VD: 7.5)
  vote_count: { type: Number },   // Số lượt vote
  genre_ids: {
    type: [Number]
  },
  genres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genres"
  }]
});
const Movies = mongoose.model("Movies", movieSchema);

module.exports = Movies;