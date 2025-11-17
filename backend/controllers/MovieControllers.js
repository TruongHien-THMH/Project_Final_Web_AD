// const Movie = require("../models/Movie");
const Movie = require("../models/Movie");

exports.fetchAllNowPlayingMovie = async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("Đang lấy dữ liệu từ TMDB...");

    const url = process.env.MOVIE_BASE_URL;
    const options = {
        method: "GET",
        headers: {
        accept: "application/json",
        Authorization:
            `Bearer ${process.env.ACCESS_TOKEN}`,
        },
    };

    console.log("Đã gọi url", url);

        
    const tmdbRes = await fetch(url, options);
    console.log("Trạng thái của API: ", tmdbRes.status);

    if(!tmdbRes.ok){
        throw new Error(`TMDB API error: ${tmdbRes.status}`);
    }
    const data = await tmdbRes.json();

    console.log("📦 Số lượng phim nhận được:", data.results?.length || 0);

    // Kiểm tra data
    if (!data.results || data.results.length === 0) {
      console.log("⚠️ Không có dữ liệu từ TMDB");
      return res.status(404).json({
        success: false,
        message: "Không có dữ liệu từ TMDB"
      });
    }

    // Xóa dữ liệu cũ
    console.log("🗑️ Đang xóa dữ liệu cũ...");
    const deleteResult = await Movie.deleteMany({});
    console.log(`✅ Đã xóa ${deleteResult.deletedCount} phim cũ`);

    // Thêm dữ liệu mới
    console.log("💾 Đang lưu dữ liệu mới...");
    const insertResult = await Movie.insertMany(data.results);
    console.log(`✅ Đã thêm ${insertResult.length} phim mới`);

    // Verify data đã được lưu
    const count = await Movie.countDocuments();
    console.log(`📊 Tổng số phim trong DB: ${count}`);

    console.log("=".repeat(50));

    // Trả response về Postman
    return res.status(200).json({
      success: true,
      message: "Cập nhật dữ liệu thành công",
      data: {
        deletedCount: deleteResult.deletedCount,
        insertedCount: insertResult.length,
        totalMovies: count
      }
    });
  } catch (error) {
        console.log("Lỗi khi cố gọi fetchAllNowPlayingMovie", error);
        console.error("ERROR FETCH:", error.cause);
        res
        .status(500)
        .json({ message: "Lỗi Controller BE, Kiểm tra terminal console.log" });
  }
};

exports.getNowPlayingMovie = async (req, res) => {
  try {
    // Lấy dữ liệu từ database
    const movies = await Movie.find().sort({ release_date: -1 });
    const result = await Movie.aggregate([
      {
        $facet: {
          nowPlaying: [{ $sort: { release_date: -1 }}],
          popular: [{ $sort: { popularity: -1 } }],
          vote: [{ $sort: { vote_average: -1} }]
        }
      }
    ])

    const nowPlayingMoive = result[0].nowPlaying;
    const popular = result[0].popular;
    const vote = result[0].vote;
    
    res.status(200).json({nowPlayingMoive, popular, vote});
  } catch (err) {
    console.log("Lỗi khi gọi getNowPlayingMovie", err);
    res
      .status(500)
      .json({ message: "Lỗi Controller BE, Kiểm tra terminal console.log" });
  }
};

exports.getMovieDetail = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    // console.log("Đã lấy được ID: ", movie);
    res.status(200).json(movie);
  } catch (error) {
    console.log("Lỗi khi gọi getMovieDetail: ", error);
    res
      .status(500)
      .json({ message: "Lỗi Controller BE, Kiểm tra terminal console.log" });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movieData = req.body;
    const movie = new Movie(movieData);

    const newData = await movie.save();
    res.status(201).json(newData);
  } catch (error) {
    console.log("Lỗi khi gọi createMovie", error);
    res.status(500).json({ message: "Lỗi khi cố tạo doc mới" });
  }
};

// exports.fetchDataPerHour = async (req, res) => {}
