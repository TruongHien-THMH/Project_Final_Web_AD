const Show = require('../../models/Show');

// GET /api/shows/:showId/seats
// Lấy thông tin sơ đồ ghế + trạng thái
exports.getSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    
    const show = await Show.findById(showId)
      .populate('movieId', 'title poster_path');
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    // Transform data cho frontend
    const seatConfig = {
      showId: show._id,
      movieTitle: show.movieId.title,
      moviePoster: show.movieId.poster_path,
      showtime: show.showTime,
      showDate: show.showDate,
      cinemaHall: show.cinemaHall,
      pricing: show.pricing,
      
      // Map layout + status
      rows: show.seatLayout.rows.map(row => ({
        rowId: row.rowId,
        rowLabel: row.rowLabel,
        seatType: row.seatType,
        seats: row.seats.map(seat => {
          // Nếu là lối đi, return null
          if (seat.isAisle) return null;
          
          // Tìm status của ghế
          const seatStatus = show.seatStatus.find(
            s => s.seatId === seat.seatId
          );
          
          let status = 'available';
          
          if (seatStatus) {
            // Nếu ghế đang selected nhưng hết hạn lock -> available
            if (seatStatus.status === 'selected' && 
                seatStatus.lockedUntil && 
                seatStatus.lockedUntil < new Date()) {
              status = 'available';
            } else {
              status = seatStatus.status;
            }
          }
          
          return {
            seatId: seat.seatId,
            number: seat.number,
            status: status
          };
        })
      }))
    };
    
    res.json(seatConfig);
    
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/shows/:showId/seats/select
// Tạm giữ ghế (lock 5 phút)
exports.selectSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const { seatIds, sessionId } = req.body;
    
    // Validate input
    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: 'seatIds is required and must be an array' });
    }
    
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required' });
    }
    
    const show = await Show.findById(showId);
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    // Check xem tất cả ghế có available không
    const unavailableSeats = [];
    
    for (const seatId of seatIds) {
      const seat = show.seatStatus.find(s => s.seatId === seatId);
      
      if (seat) {
        // Auto unlock nếu hết hạn
        if (seat.status === 'selected' && 
            seat.lockedUntil && 
            seat.lockedUntil < new Date()) {
          seat.status = 'available';
          seat.lockedBy = null;
          seat.lockedUntil = null;
        }
        
        // Check status (cho phép nếu đang lock bởi chính session này)
        if (seat.status !== 'available' && seat.lockedBy !== sessionId) {
          unavailableSeats.push(seatId);
        }
      }
    }
    
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are not available',
        unavailableSeats 
      });
    }
    
    // Lock ghế trong 5 phút
    const lockExpiry = new Date(Date.now() + 5 * 60 * 1000);
    
    for (const seatId of seatIds) {
      const seatIndex = show.seatStatus.findIndex(s => s.seatId === seatId);
      
      if (seatIndex === -1) {
        // Ghế chưa có status -> tạo mới
        show.seatStatus.push({
          seatId,
          status: 'selected',
          lockedBy: sessionId,
          lockedUntil: lockExpiry
        });
      } else {
        // Update existing
        show.seatStatus[seatIndex].status = 'selected';
        show.seatStatus[seatIndex].lockedBy = sessionId;
        show.seatStatus[seatIndex].lockedUntil = lockExpiry;
      }
    }
    
    await show.save();
    
    res.json({ 
      success: true,
      message: 'Seats locked successfully',
      lockedUntil: lockExpiry,
      seatIds 
    });
    
  } catch (error) {
    console.error('Error locking seats:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/shows/:showId/seats/unselect
// Hủy tạm giữ ghế
exports.unselectSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const { seatIds, sessionId } = req.body;
    
    const show = await Show.findById(showId);
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    // Unlock ghế
    for (const seatId of seatIds) {
      const seat = show.seatStatus.find(
        s => s.seatId === seatId && s.lockedBy === sessionId
      );
      
      if (seat && seat.status === 'selected') {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockedUntil = null;
      }
    }
    
    await show.save();
    
    res.json({ 
      success: true,
      message: 'Seats unlocked successfully' 
    });
    
  } catch (error) {
    console.error('Error unlocking seats:', error);
    res.status(500).json({ message: error.message });
  }
};