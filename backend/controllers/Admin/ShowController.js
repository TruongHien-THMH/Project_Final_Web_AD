const Show = require('../../models/Show');
const Movie = require('../../models/Movie');

exports.addShow = async (req, res) => {
  try {
    const { movieId, showTime, showDate, price, cinemaHall } = req.body;

    if (!movieId || !showTime || !showDate || !price || !cinemaHall) {
      return res.status(400).json({ message: "Missing fields!" });
    }

    // Kiểm tra movie có tồn tại không
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found!" });
    }

    const newShow = await Show.create({
      movieId,
      showTime,
      showDate,
      price,
      cinemaHall
    });

    res.status(201).json({
      message: "Show created successfully!",
      show: newShow
    });

  } catch (error) {
    console.error("Error adding show:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// THÊM API MỚI - Lấy tất cả shows
exports.getAllShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('movieId');
    
    res.status(200).json({
      success: true,
      message: "Shows fetched successfully!",
      shows: shows
    });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// THÊM API MỚI - Xóa show
exports.deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedShow = await Show.findByIdAndDelete(id);
    
    if (!deletedShow) {
      return res.status(404).json({ 
        success: false,
        message: "Show not found!" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Show deleted successfully!" 
    });
  } catch (error) {
    console.error("Error deleting show:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};