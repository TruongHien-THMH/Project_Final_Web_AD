// Code chứa các controller chung về movie:
const Movies =  require('../../models/Movies');
const Genres = require("../../models/Genres");

exports.getMovieList = async (req, res) => {
    try {
        const movies = await Movies.find().populate("genres"); // Lấy từ ngày gần nhất
        
        return res.status(200).json(movies);
    } catch (error) {
        console.log("Lỗi dịch vụ getMovieList: ", error);
        return res.status(500).json({message: "Lỗi khi sử dụng vụ get Movie List"});
    }
}

exports.getMovieDetail = async (req, res) => {
    try {
        const movieId = req.params.id;

        const url = `${process.env.MOVIE_DETAILS_URL}/${movieId}?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        };
        const movieTMDBRespone = await fetch(url, options);
        const movieDetailTMDB = await movieTMDBRespone.json();

        // const movieDetail = await Movies.findById( movieId );
        if(!movieDetailTMDB) {
            return res.status(404).json({message: "Không nhận id"})
        }

        return res.status(200).json(movieDetailTMDB);
    } catch (error) {
        console.log("Lỗi dịch vụ getMovieDetail: ", error);
        return res.status(500).json({message: "Lỗi khi sử dụng vụ get Movie Detail"});
    }
}