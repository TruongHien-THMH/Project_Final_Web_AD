const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const showRoutes = require("./routes/showRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const movieRouter = require('./routes/movieRoutes');

app.use('/api/cinema', movieRouter);

const PORT = 5001 || process.env.PORT;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        // corn;
        // require("./cron/fetchMovie");
    });
});

