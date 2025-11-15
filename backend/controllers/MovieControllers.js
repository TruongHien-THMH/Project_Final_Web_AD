const Movie = require("../models/Movie");

exports.getNowPlayingMovie = async (req, res) => {
    try{
        // Lấy dữ liệu từ database
        // const movies = await Moive.find();
        // res.json(movies);
        res.json({messgae: 'Đã gọi được controller'})
    } catch (err) {
        console.log("Lỗi khi cố lấy dữ liệu của API phim đang chiếu:");
        console.error(err);
    }
}

// exports.fetchDataPerHour = async (req, res) => {}