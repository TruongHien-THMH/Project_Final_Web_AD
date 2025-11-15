const mongoose = require("mongoose");

const ShowSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  datetime: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Show", ShowSchema);
