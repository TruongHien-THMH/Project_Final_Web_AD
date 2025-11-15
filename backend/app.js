const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const movieRouter = require('./routes/movieRoutes');
const showRoutes = require("./routes/showRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.get("/api/cinema", (req, res) => {
//     res.send("Backend cinema is running...");
// });
const movieRouter = require('./routes/movieRoutes');
app.use('/api/cinema', movieRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
