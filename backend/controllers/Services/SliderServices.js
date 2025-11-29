
const Movies = require("../../models/Movies"); 


const getSliderMovies = async (req, res) => {
    try {
        const movies = await Movies.find({ poster_path: { $ne: null } })
            .sort({ release_date: -1 }) // Sắp xếp theo ngày ra mắt giảm dần (mới nhất)
            .limit(5)
            .populate("genres"); 
            
        res.status(200).json(movies);
    } catch (error) {
        console.error("Lỗi Slider:", error);
        res.status(500).json({ message: "Lỗi Server khi lấy slider" });
    }
};

module.exports = {
    getSliderMovies,
};