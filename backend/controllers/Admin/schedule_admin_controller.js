const Schedule = require("../../models/Schedule.model");
const Movie = require("../../models/Movies");
const Room = require("../../models/Room.model");
const mongoose = require("mongoose");

const CONFIG = {
    OPENING_HOUR: 7,   // 7 giờ sáng
    CLOSING_HOUR: 23,  // 23 giờ đêm
    ADS_TIME_MIN: 10,  // 10 phút quảng cáo
    CLEAN_TIME_MIN: 20 // 20 phút dọn dẹp
};

// Hàm kiểm tra lịch chiếu có trùng hay không ?
const checkConflict = async (roomId, newStart, newEnd, excludeScheduleId = null) => {
    const query = {
        roomId: roomId,
        $and: [
            { time_start : { $lt: newEnd } },
            { time_end: {$gt: newStart} } 
        ]
    }

    // check có đang sửa lịch chiếu không!
    if(excludeScheduleId){
        query._id = { $ne: excludeScheduleId };
    }

    const conflict = await Schedule.findOne(query);

    return !!conflict;
}

exports.createSchedule = async (req, res) => {
    try {
        const { movieId, roomId, time_start } = req.body;

        const movie = await Movie.findOne(movieId);

        const startTime = new Date(time_start);
        const endTime = new Date(startTime.getTime() + movie.runtime * 60000);

        const isConflict = await checkConflict(roomId, startTime, endTime);
        if(isConflict){
            return res.status(400).json({
                message: "Phòng này đã có lịch chiếu"
            })
        }

        const newSchedule = await Schedule.create({
            movieId,
            roomId,
            time_start: startTime,
            time_end: endTime,
            booked_seats: [],
            pendding_seats: []
        })

        return res.status(201).json({
            message: "Tạo lịch chiếu thành công!",
            data: newSchedule
        });
    } catch (err) {
        console.log("Lỗi khi tạo lịch chiếu // createSchedule: ", err);
        return res.status(500).json({
            message: "Lỗi BE: ",
            error: err.message
        } )
    }
}

exports.autoGenerateSchedules = async (req, res) => {
    try {
        const {
            movieIds, 
            theaterIds, 
            fromDate, 
            toDate 
        } = req.body;

        // Validation
        if (!movieIds?.length || !theaterIds?.length || !fromDate || !toDate) {
            return res.status(400).json({ message: "Vui lòng chọn phim, rạp và thời gian!" });
        }

        // Tìm phòng từ danh sách Rạp
        const rooms = await Room.find({ movie_theater_id: { $in: theaterIds } });
        if (rooms.length === 0) {
            return res.status(404).json({ message: "Các rạp đã chọn chưa có phòng chiếu nào!" });
        }
        const realRoomIds = rooms.map(r => r._id);

        // Chuẩn hóa thời gian Check trùng
        const startRange = new Date(fromDate);
        startRange.setHours(0, 0, 0, 0);
        const endRange = new Date(toDate);
        endRange.setHours(23, 59, 59, 999);

        // Kiểm tra trùng lịch
        const existingSchedules = await Schedule.findOne({
            roomId: { $in: realRoomIds }, // Hãy đảm bảo field này khớp Model (roomId hay room_id)
            time_start: { $gte: startRange, $lte: endRange }
        });

        if (existingSchedules) {
            return res.status(409).json({
                message: "Đã tồn tại lịch chiếu. Vui lòng xóa lịch cũ hoặc chọn ngày khác!"
            });
        }

        const movies = await Movie.find({ _id: { $in: movieIds } });
        if (movies.length === 0) return res.status(404).json({ message: "Không tìm thấy phim" });

        const newSchedules = [];
        let currentMovieIndex = 0;
        
        // Clone ngày bắt đầu để không làm biến đổi biến gốc
        let currentDate = new Date(startRange);

        // ======================================================
        // VÒNG LẶP CHÍNH (Đã tối ưu)
        // ======================================================
        while (currentDate <= endRange) {
            
            for (const room of rooms) {
                // Set Giờ Mở Cửa
                let timeCursor = new Date(currentDate);
                timeCursor.setHours(CONFIG.OPENING_HOUR, 0, 0, 0);

                // Set Giờ Đóng Cửa
                let closeTime = new Date(currentDate);
                closeTime.setHours(CONFIG.CLOSING_HOUR, 0, 0, 0);

                // --- VÒNG LẶP XẾP SUẤT CHIẾU ---
                // Thay vì while(true), ta dùng điều kiện timeCursor < closeTime cho an toàn
                while (timeCursor < closeTime) {
                    const movie = movies[currentMovieIndex];

                    let runtime = movie.runtime;
                    
                    // Nếu DB thiếu runtime hoặc runtime không phải số -> Gán mặc định 90 phút
                    if (!runtime || isNaN(runtime)) {
                        console.warn(`⚠️ Cảnh báo: Phim "${movie.title}" (ID: ${movie._id}) thiếu runtime. Dùng mặc định 90 phút.`);
                        runtime = 90; 
                    }
                    // Tính thời gian kết thúc
                    // Công thức: Start + (Quảng cáo * 60000) + (Runtime * 60000)
                    const totalDurationMs = (CONFIG.ADS_TIME_MIN * 60000) + (runtime * 60000);
                    let endTime = new Date(timeCursor.getTime() + totalDurationMs);
                    
                    // KIỂM TRA ĐIỀU KIỆN THOÁT:
                    // Nếu chiếu xong mà lố giờ đóng cửa -> Break ngay lập tức
                    if (endTime > closeTime) {
                        break; 
                    }

                    newSchedules.push({
                        movieId: movie._id,
                        roomId: room._id,
                        time_start: new Date(timeCursor), // Lưu ý tạo bản sao Date mới
                        time_end: endTime,
                        booked_seats: [],
                        pending_seats: []
                    });

                    // Cập nhật con trỏ thời gian cho suất sau
                    // Start Mới = End Cũ + Thời gian dọn dẹp
                    timeCursor = new Date(endTime.getTime() + (CONFIG.CLEAN_TIME_MIN * 60000));

                    // Xoay vòng phim
                    currentMovieIndex = (currentMovieIndex + 1) % movies.length;
                }
            }
            
            // Tăng ngày lên 1 (An toàn hơn cách setDate trực tiếp)
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Insert dữ liệu
        if (newSchedules.length > 0) {
            await Schedule.insertMany(newSchedules);
        }

        return res.status(201).json({
            message: `Thành công! Đã tạo ${newSchedules.length} suất chiếu.`,
            data: newSchedules
        });

    } catch (error) {
        console.error("Lỗi Auto Generate:", error); // Dùng console.error cho dễ nhìn
        return res.status(500).json({
            message: "Lỗi Server: " + error.message,
        });
    }
};
