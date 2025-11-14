import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  id: Number,
  title: String,
  original_title: String,
  overview: String,
  poster_path: String,
  release_date: String,
  genre_ids: [Number],
});

export default mongoose.model("Movie", movieSchema);