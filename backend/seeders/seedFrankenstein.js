const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Show = require('../models/Show');
const Movie = require('../models/Movie');

dotenv.config({ path: '../.env' }); // Load .env từ thư mục backend

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinema-booking');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Tạo seat layout chuẩn
const createSeatLayout = () => ({
  rows: [
    // VIP rows (2 rows, 9 seats each)
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
    
    // Standard rows with aisles (2 rows with side aisles)
    {
      rowId: 'C',
      rowLabel: 'C',
      seatType: 'STANDARD',
      seats: [
        { seatId: 'C_aisle_left', number: 0, isAisle: true },
        ...Array(14).fill(null).map((_, i) => ({
          seatId: `C${i + 1}`,
          number: i + 1,
          isAisle: false
        })),
        { seatId: 'C_aisle_right', number: 15, isAisle: true }
      ]
    },
    {
      rowId: 'D',
      rowLabel: 'D',
      seatType: 'STANDARD',
      seats: [
        { seatId: 'D_aisle_left', number: 0, isAisle: true },
        ...Array(14).fill(null).map((_, i) => ({
          seatId: `D${i + 1}`,
          number: i + 1,
          isAisle: false
        })),
        { seatId: 'D_aisle_right', number: 15, isAisle: true }
      ]
    },
    
    // Full standard rows (no aisles)
    ...['E', 'F', 'G', 'H'].map(letter => ({
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

// Tạo random booked seats để realistic hơn
const createRandomBookedSeats = (percentage = 0.15) => {
  const allSeats = [
    ...Array(9).fill(null).map((_, i) => `A${i + 1}`),
    ...Array(9).fill(null).map((_, i) => `B${i + 1}`),
    ...Array(14).fill(null).map((_, i) => `C${i + 1}`),
    ...Array(14).fill(null).map((_, i) => `D${i + 1}`),
    ...Array(16).fill(null).map((_, i) => `E${i + 1}`),
    ...Array(16).fill(null).map((_, i) => `F${i + 1}`),
    ...Array(16).fill(null).map((_, i) => `G${i + 1}`),
    ...Array(16).fill(null).map((_, i) => `H${i + 1}`)
  ];
  
  const numberOfBookedSeats = Math.floor(allSeats.length * percentage);
  const bookedSeats = [];
  
  // Random select seats
  const shuffled = allSeats.sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < numberOfBookedSeats; i++) {
    bookedSeats.push({
      seatId: shuffled[i],
      status: 'booked'
    });
  }
  
  return bookedSeats;
};

const seedFrankensteinShows = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Finding Frankenstein movie...');
    
    // Tìm movie Frankenstein bằng _id
    const movie = await Movie.findById('6919d1b25ff8bae1b66bedc5');
    
    if (!movie) {
      console.error('❌ Frankenstein movie not found!');
      console.log('Searching for any movie with "Frankenstein" in title...');
      
      const altMovie = await Movie.findOne({ 
        title: { $regex: /Frankenstein/i } 
      });
      
      if (altMovie) {
        console.log('✅ Found alternative:', altMovie.title, '| ID:', altMovie._id);
        console.log('Please update the movie ID in the seed script');
      } else {
        console.log('No movie found. Available movies:');
        const movies = await Movie.find().limit(5);
        movies.forEach(m => console.log(`  - ${m.title} | ID: ${m._id}`));
      }
      
      await mongoose.disconnect();
      process.exit(1);
    }
    
    console.log('✅ Found movie:', movie.title);
    console.log('   Movie ID:', movie._id);
    
    // Xóa shows cũ của movie này (nếu có)
    const deleted = await Show.deleteMany({ movieId: movie._id });
    console.log(`🗑️  Deleted ${deleted.deletedCount} old shows`);
    
    // Tạo shows cho nhiều ngày và giờ khác nhau
    const today = new Date();
    const showsToCreate = [];
    
    // Tạo shows cho 7 ngày tới
    for (let day = 0; day < 7; day++) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + day);
      const dateString = showDate.toISOString().split('T')[0];
      
      // Mỗi ngày có 4 suất chiếu
      const showtimes = ['10:00', '14:30', '19:00', '21:30'];
      const halls = [1, 2, 1, 2]; // Phòng chiếu luân phiên
      
      for (let i = 0; i < showtimes.length; i++) {
        showsToCreate.push({
          movieId: movie._id,
          showTime: showtimes[i],
          showDate: dateString,
          price: 65000, // Default price
          cinemaHall: halls[i],
          pricing: {
            vip: 100000,
            standard: 65000
          },
          seatLayout: createSeatLayout(),
          seatStatus: createRandomBookedSeats(0) // 20% ghế đã booked
        });
      }
    }
    
    // Bulk create
    console.log(`\n📝 Creating ${showsToCreate.length} shows...`);
    const createdShows = await Show.insertMany(showsToCreate);
    
    console.log('\n✅ Successfully created shows:');
    console.log(`   Total shows: ${createdShows.length}`);
    console.log(`   Movie: ${movie.title}`);
    console.log(`   Date range: ${showsToCreate[0].showDate} to ${showsToCreate[showsToCreate.length - 1].showDate}`);
    console.log(`   Showtimes: 10:00, 14:30, 19:00, 21:30`);
    console.log(`   Cinema Halls: 1, 2`);
    
    // Show một vài show IDs để test
    console.log('\n📋 Sample Show IDs for testing:');
    createdShows.slice(0, 4).forEach(show => {
      console.log(`   - ${show._id} | ${show.showDate} ${show.showTime} | Hall ${show.cinemaHall}`);
    });
    
    console.log('\n🎬 You can now test booking with these show IDs!');
    console.log(`   Example: http://localhost:3000/movie/${movie._id}/date?showId=${createdShows[0]._id}`);
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding shows:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run seed
seedFrankensteinShows();