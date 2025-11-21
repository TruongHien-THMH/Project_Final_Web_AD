// Code chứa các controller chung về movie:

const Movie =  require('../../models/Movie');

exports.getMovieList = async (req, res) => {
    try {
        const movieList = await Movie.find().sort({ release_date: -1 }); // Lấy từ ngày gần nhất
        return res.status(200).json(movieList);
    } catch (error) {
        console.log("Lỗi dịch vụ getMovieList: ", error);
        return res.status(500).json({message: "Lỗi khi sử dụng vụ get Movie List"});
    }
}

exports.getMovieDetail = async (req, res) => {
    try {
        const movieId = req.params.id;
        // console.log(`--${movieId}--`);

        const movieDetail = await Movie.findById( movieId );
        if(!movieDetail) {
            return res.status(404).json({message: "Không nhận id"})
        }
        return res.status(200).json(movieDetail);
    } catch (error) {
        console.log("Lỗi dịch vụ getMovieDetail: ", error);
        return res.status(500).json({message: "Lỗi khi sử dụng vụ get Movie Detail"});
    }
}