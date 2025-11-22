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
const adminShowRoutes = require("./routes/showRoutes");
const userShowRoutes = require("./routes/userShowRoutes");
const movieRoutes = require("./routes/users/movie_user_route"); 

app.use("/api/cinema", movieUserRouter);
// app.use("/api/cinema", movieRoutes); 
app.use("/api/showTime", userShowRoutes);
app.use("/api/admin/shows", adminShowRoutes); 

const PORT = 5001 || process.env.PORT ;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
});