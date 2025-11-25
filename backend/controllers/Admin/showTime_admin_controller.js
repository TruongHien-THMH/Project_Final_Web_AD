const Show = require('../../models/Show');
const Movies = require('../../models/Movies');

exports.addShow = async (req, res) => {
  try {
    const { movieId, showTime, showDate, price, cinemaHall } = req.body;

    if (!movieId || !showTime || !showDate || !price || !cinemaHall) {
      return res.status(400).json({ message: "Missing fields!" });
    }

    const movie = await Movies.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found!" });
    }

    const newShow = await Show.create({
      movieId,
      showTime,
      showDate,
      price,
      cinemaHall
    });

    res.status(201).json({
      message: "Show created successfully!",
      show: newShow
    });

  } catch (error) {
    console.error("Error adding show:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('movieId');
    
    res.status(200).json({
      success: true,
      message: "Shows fetched successfully!",
      shows: shows
    });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedShow = await Show.findByIdAndDelete(id);
    
    if (!deletedShow) {
      return res.status(404).json({ 
        success: false,
        message: "Show not found!" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Show deleted successfully!" 
    });
  } catch (error) {
    console.error("Error deleting show:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// ========== NEW: SEED SHOWS ==========
exports.seedShows = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const movie = await Movies.findById(movieId);
    if (!movie) {
      return res.status(404).json({ 
        success: false,
        message: 'Movie not found' 
      });
    }
    
    await Show.deleteMany({ movieId: movie._id });
    
    const createSeatLayout = () => ({
      rows: [
        {
          rowId: 'A',
          rowLabel: 'A',
          seatType: 'VIP',
          seats: Array(9).fill(null).map((_, i) => ({
            seatId: `A${i + 1}`,
            number: i + 1,
            isAisle: false
          }))
        },
        {
          rowId: 'B',
          rowLabel: 'B',
          seatType: 'VIP',
          seats: Array(9).fill(null).map((_, i) => ({
            seatId: `B${i + 1}`,
            number: i + 1,
            isAisle: false
          }))
        },
        ...['C', 'D', 'E', 'F', 'G', 'H'].map(letter => ({
          rowId: letter,
          rowLabel: letter,
          seatType: 'STANDARD',
          seats: Array(16).fill(null).map((_, i) => ({
            seatId: `${letter}${i + 1}`,
            number: i + 1,
            isAisle: false
          }))
        }))
      ]
    });
    
    const createRandomBookedSeats = (percentage = 0.2) => {
      const allSeats = [];
      for (let i = 1; i <= 9; i++) {
        allSeats.push(`A${i}`);
        allSeats.push(`B${i}`);
      }
      ['C', 'D', 'E', 'F', 'G', 'H'].forEach(letter => {
        for (let i = 1; i <= 16; i++) {
          allSeats.push(`${letter}${i}`);
        }
      });
      const count = Math.floor(allSeats.length * percentage);
      const shuffled = allSeats.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count).map(seatId => ({
        seatId,
        status: 'booked'
      }));
    };
    
    const today = new Date();
    const showsToCreate = [];
    
    for (let day = 0; day < 7; day++) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + day);
      const dateString = showDate.toISOString().split('T')[0];
      
      const showtimes = ['10:00', '14:30', '19:00', '21:30'];
      const halls = [1, 2, 1, 2];
      
      for (let i = 0; i < showtimes.length; i++) {
        showsToCreate.push({
          movieId: movie._id,
          showTime: showtimes[i],
          showDate: dateString,
          price: 65000,
          cinemaHall: halls[i],
          pricing: { vip: 100000, standard: 65000 },
          seatLayout: createSeatLayout(),
          seatStatus: createRandomBookedSeats(0.2)
        });
      }
    }
    
    const createdShows = await Show.insertMany(showsToCreate);
    
    res.json({
      success: true,
      message: `Created ${createdShows.length} shows for "${movie.title}"`,
      summary: {
        movieTitle: movie.title,
        totalShows: createdShows.length,
        dateRange: `${showsToCreate[0].showDate} to ${showsToCreate[showsToCreate.length - 1].showDate}`
      },
      sampleShows: createdShows.slice(0, 4).map(show => ({
        showId: show._id,
        date: show.showDate,
        time: show.showTime,
        hall: show.cinemaHall,
        testUrl: `http://localhost:3000/movie/${movie._id}/date?showId=${show._id}`
      }))
    });
    
  } catch (error) {
    console.error('Error seeding shows:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};