// const Movie = require("../models/Movie");
const Movies = require("../../models/Movies");
const Genres = require("../../models/Genres");
const fetch = require('node-fetch');
const axios = require('axios');

exports.fetchAllNowPlayingMovie = async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("🚀 Bắt đầu cập nhật phim từ TMDB...");

    // 1. Fetch danh sách ID phim đang chiếu (Now Playing)
    const nowPlayingUrl = process.env.MOVIE_BASE_URL;
    
    // ✅ SỬA: Cấu hình Header cho Axios
    const options = {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
    };

    // ✅ SỬA: Gọi API bằng axios.get
    // Axios tự động parse JSON và ném lỗi nếu status code là 4xx/5xx (không cần check !res.ok)
    const npRes = await axios.get(nowPlayingUrl, options);
    const movieListBasic = npRes.data.results;

    if (!movieListBasic || movieListBasic.length === 0) {
        return res.status(404).json({ success: false, message: "Không tìm thấy phim nào từ TMDB" });
    }

    console.log(`📦 Tìm thấy ${movieListBasic.length} phim. Đang lấy chi tiết (Runtime)...`);

    // 2. Chuẩn bị Map Genres để mapping ID -> ObjectId
    const allGenres = await Genres.find();
    const genresMap = {};
    allGenres.forEach(g => { genresMap[g.id] = g._id; });

    // 3. Fetch chi tiết từng phim (Parallel Fetching)
    const detailedMovies = await Promise.all(
        movieListBasic.map(async (movieBasic) => {
            try {
                // Gọi API Detail cho từng phim
                const detailUrl = `https://api.themoviedb.org/3/movie/${movieBasic.id}`; // VD: https://api.themoviedb.org/3/movie/123
                
                // ✅ SỬA: Dùng axios
                const detailRes = await axios.get(detailUrl, options);
                const detailData = detailRes.data;

                // Map Genre IDs
                const mappedGenres = (movieBasic.genre_ids || []).map(id => genresMap[id]).filter(id => id);

                return {
                    id: movieBasic.id,
                    title: movieBasic.title,
                    original_title: movieBasic.original_title,
                    overview: movieBasic.overview,
                    poster_path: movieBasic.poster_path,
                    backdrop_path: movieBasic.backdrop_path,
                    release_date: movieBasic.release_date,
                    vote_average: movieBasic.vote_average,
                    vote_count: movieBasic.vote_count,
                    
                    // QUAN TRỌNG: Lấy runtime
                    runtime: detailData.runtime || 0, 
                    
                    genres: mappedGenres
                };
            } catch (err) {
                console.error(`⚠️ Lỗi khi lấy chi tiết phim ID ${movieBasic.id}:`, err.message);
                return null; // Bỏ qua phim lỗi
            }
        })
    );

    // Lọc bỏ các phim bị lỗi (null)
    const validMovies = detailedMovies.filter(m => m !== null);

    // 4. Lưu vào Database
    console.log("🗑️ Đang xóa dữ liệu cũ...");
    await Movies.deleteMany({}); 

    console.log(`💾 Đang lưu ${validMovies.length} phim mới vào DB...`);
    const insertResult = await Movies.insertMany(validMovies);

    console.log("✅ Hoàn tất cập nhật!");
    console.log("=".repeat(50));

    return res.status(200).json({
      success: true,
      message: "Cập nhật phim thành công (Kèm Runtime)",
      data: {
        total: insertResult.length,
        movies: insertResult
      }
    });

  } catch (error) {
    console.error("❌ Lỗi Controller:", error.message); // In error.message cho gọn
    return res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};

exports.fetchGenres = async (req, res) => {
  try {
    const url = process.env.GENRES_BASE_URL;
    const opt = {
          method: "GET",
          headers: {
          accept: "application/json",
          Authorization:
              `Bearer ${process.env.ACCESS_TOKEN}`,
          },
      };
    const data = await fetch(url, opt);

    if(!data.ok){
        throw new Error(`TMDB API error: ${data.status}`);
    }

    const genresJson = await data.json();
    // const genresArr = genresJson.genres;

    await Genres.deleteMany({});

    // await Genres.insertMany(genresJson.genres);

    genresJson.genres.forEach(genre => {
      Genres.insertOne(genre);
    });

    if(Genres.length > 0){
      console.log("Thêm thành công");
    }

    return res.status(200).json({
      success: true,
      message: "Thêm thể loại phim thành công",
      data: {
        gernesList:  genresJson.genres
      }
    });
    

  } catch (error) {
    console.log("Lỗi không thể gọi fetchGernes: ");
    console.log("Lỗi khi call BE: ", error);
  }
}

exports.getNowPlayingMovie = async (req, res) => {
  try {
    // Lấy dữ liệu từ database
    const movies = await Movies.find();
    res.status(200).json(movies);
    
  } catch (err) {
    console.log("Lỗi khi gọi getNowPlayingMovie", err);
    res
      .status(500)
      .json({ message: "Lỗi Controller BE, Kiểm tra terminal console.log" });
  }
};

exports.getMovieDetail = async (req, res) => {
  try {
    const movie = await Movies.findOne({ id: req.params.id });
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
    const { 
        title, 
        original_title, 
        overview, 
        runtime, 
        poster_path, 
        backdrop_path,
        release_date 
    } = req.body;

    // 1. Validate cơ bản
    if (!title || !runtime) {
        return res.status(400).json({ message: "Tên phim và Thời lượng là bắt buộc!" });
    }

    // 2. Tạo ID giả lập (Vì Model yêu cầu id kiểu Number, Unique)
    // Dùng timestamp để đảm bảo không trùng
    const generatedId = Math.floor(Date.now() / 1000); 

    // 3. Tạo đối tượng Movie mới
    const movie = new Movies({
        id: generatedId, // ID tự sinh
        title,
        original_title: original_title || title, // Nếu không nhập thì lấy title
        overview: overview || "Chưa có mô tả",
        runtime: parseInt(runtime),
        poster_path: poster_path || "",
        backdrop_path: backdrop_path || "", // Thêm trường này
        release_date: release_date || new Date().toISOString(),
        vote_average: 0, // Mặc định
        vote_count: 0,
        genre_ids: [], // Tạm thời để trống hoặc xử lý sau nếu có UI chọn Genre
        genres: []
    });

    const newData = await movie.save();
    
    return res.status(201).json({
        message: "Tạo phim thủ công thành công!",
        data: newData
    });

  } catch (error) {
    console.error("Lỗi createMovie:", error);
    // Xử lý lỗi trùng ID (hiếm gặp với Date.now nhưng vẫn nên catch)
    if (error.code === 11000) {
        return res.status(400).json({ message: "Phim hoặc ID đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi Server khi tạo phim", error: error.message });
  }
};



// exports.fetchDataPerHour = async (req, res) => {}
