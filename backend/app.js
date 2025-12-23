const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { verifyAdmin, verifyToken } = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authUserRouter = require("./routes/users/auth.routes");

const userRoutes = require("./routes/users/user.routes");
const movieUserRouter = require("./routes/users/movie_user_route");
const userShowRoutes = require("./routes/userShowRoutes");
const userBookRoutes = require("./routes/users/book.user.route");
const userScheduleRoutes = require('./routes/users/schedules_user_routes');

const adminShowRoutes = require("./routes/showRoutes");
const adminMovieRoutes = require("./routes/admin/movieRoutes");
const adminScheduleRoutes = require("./routes/admin/scheduleRoutes");
const adminMovieTheaterRoutes = require("./routes/admin/movie.theaterRoutes");
const adminStatsRoutes = require("./routes/admin/statsRoutes");
app.use("/api/auth", authUserRouter);

// Api cho user và admin lấy danh sách phim
app.use("/api/cinema", movieUserRouter);
// API làm việc với đặt vé: 
app.use("/api/schedules", userScheduleRoutes);

app.use("/api/book",verifyToken , userBookRoutes);

app.use("/api/user",verifyToken , userRoutes);

// app.use("/api/cinema", movieRoutes); 
// API của Hoàng - SeatBooking -- Hồi định nghĩa nghen
app.use("/api/showTime", userShowRoutes);

// API làm việc với Phim và Danh sách các phim (TMDB)
app.use("/api/admin/movie", verifyAdmin, adminMovieRoutes);
// API của Trí làm việc với SHOWTIME -- Lịch chiếu -- Suất chiếu: 
app.use("/api/admin/shows", verifyAdmin, adminShowRoutes); 
// API Của Hiển --- Tạo mới rạp phim;
app.use("/api/admin/movie_theater", verifyAdmin, adminMovieTheaterRoutes);
// API Của Hiển --- Làm việc với Suất chiếu;
app.use("/api/admin/schedules", verifyAdmin ,adminScheduleRoutes);
// API Thống kê Dashboard
app.use("/api/admin/stats", verifyAdmin, adminStatsRoutes);


const PORT = 5001 || process.env.PORT ;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
});