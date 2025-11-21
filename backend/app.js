const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const movieRoutes = require("./routes/movieRoutes");
const adminShowRoutes = require("./routes/showRoutes"); // Admin routes
const userShowRoutes = require("./routes/userShowRoutes"); // User booking routes

// Routes
app.use("/api/cinema", movieRoutes);
app.use("/shows", adminShowRoutes); // Admin: CRUD shows
app.use("/api/shows", userShowRoutes); // User: Booking seats

const PORT = 5001 || process.env.PORT;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});