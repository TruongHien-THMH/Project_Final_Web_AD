const Show = require("../models/Show");

exports.addShow = async (req, res) => {
  try {
    const { movieId, price, datetime } = req.body;

    if (!movieId || !price || !datetime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newShow = await Show.create({
      movieId,
      price,
      datetime
    });

    res.json({
      message: "Show added successfully",
      show: newShow
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
