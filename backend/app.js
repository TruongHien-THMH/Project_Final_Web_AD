const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const movieUserRouter = require("./routes/users/movie_user_route");
const userShowRoutes = require("./routes/userShowRoutes");
const userBookRoutes = require("./routes/users/book.user.route");

const adminShowRoutes = require("./routes/showRoutes");
const adminMovieRoutes = require("./routes/admin/movieRoutes");
const adminScheduleRoutes = require("./routes/admin/scheduleRoutes");
const adminMovieTheaterRoutes = require("./routes/admin/movie.theaterRoutes");
// Api cho user và admin lấy danh sách phim
app.use("/api/cinema", movieUserRouter);
// API làm việc với đặt vé: 
app.use("/api/book", userBookRoutes);

// app.use("/api/cinema", movieRoutes); 
// API của Hoàng - SeatBooking -- Hồi định nghĩa nghen
app.use("/api/showTime", userShowRoutes);
// API làm việc với Phim và Danh sách các phim (TMDB)
app.use("/api/admin/movie", adminMovieRoutes);
// API của Trí làm việc với SHOWTIME -- Lịch chiếu -- Suất chiếu: 
app.use("/api/admin/shows", adminShowRoutes); 
// API Của Hiển --- Tạo mới rạp phim;
app.use("/api/admin/movie_theater", adminMovieTheaterRoutes);
// API Của Hiển --- Làm việc với Suất chiếu;
app.use("/api/admin/schedules", adminScheduleRoutes);



const PORT = 5001 || process.env.PORT ;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
});