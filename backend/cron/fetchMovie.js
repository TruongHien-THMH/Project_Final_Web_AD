const cron = require("node-cron");
const fetch = require("node-fetch");
const Movie = require("../models/Movie");

// Cron chạy mỗi tuần vào 0h sáng thứ 2
cron.schedule("*/10 * * * * *", async () => {
  try {
    console.log("⏰ Bắt đầu fetch TMDB...");

    // const url = process.env.MOVIE_BASE_URL;
    // const options = {
    //   method: "GET",
    //   headers: {
    //     accept: "application/json",
    //     Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
    //   }
    // };

    // const res = await fetch(url, options);
    // const data = await res.json();

    // // Kiểm tra data có results không
    // if (!data.results || data.results.length === 0) {
    //   console.log("❌ Không có dữ liệu từ TMDB");
    //   return;
    // }

    // // Xóa movies cũ (tùy chọn)
    // await Movie.deleteMany({});
    // console.log("🗑️ Đã xóa dữ liệu cũ");

    // // Insert movies mới
    // await Movie.insertMany(data.results);
    // console.log(`✅ Cập nhật ${data.results.length} phim thành công!`);

  } catch (err) {
    console.log("❌ Lỗi cron fetch movies:", err);
  }
});

console.log("🚀 Cron job đã được khởi động - Chạy mỗi tuần vào 0h thứ 2");