const Schedule = require("../../models/Schedule.model");
const Movie = require("../../models/Movies");

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
