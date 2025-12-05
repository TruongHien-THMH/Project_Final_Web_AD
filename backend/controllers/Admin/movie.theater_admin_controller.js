const MovieTheater = require('../../models/MovieTheater.model');
const Room = require('../../models/Room.model');

exports.createTheater = async (req, res) => {
    try {
        const { iName , iAddress , iHallCount , rowLayout, colLayout} = req.body;
        if(!iName || !iAddress || !iHallCount){
            return res.status(400).json({message: "Vui lòng điền đủ thông tin để tạo rạp"});
        }

        const defaultRows = rowLayout || 10;
        const defaultCols = colLayout || 10;

        const newTheater = await MovieTheater.create({
            name: iName,
            address: iAddress,
            hallCount: parseInt(iHallCount),
        });

        const roomsToCreate = [];

        for(let i = 1; i <= parseInt(iHallCount); i++){
            roomsToCreate.push({
                movie_theater_id: newTheater._id,
                name: `Hall ${i}`, 
                seatRow: defaultRows,
                seatCol: defaultCols
            });
        }

        const createdRooms = await Room.insertMany(roomsToCreate);

        return res.status(201).json({
            message: "Đã tạo thành công rạp",
            movie_theater: newTheater,
            rooms: createdRooms
        })

    } catch (error) {
        console.log("Lỗi từ BE tạo Rạp mới: ", error);
        return res.status(500).json({
            message: "Lỗi khi tạo rạp",
            error: error.message
        })
    }
}

exports.getTheaters = async (req, res) => {
    try {
        const theaters = await MovieTheater.find();
        if(theaters.length === 0) {
            return res.status(200).json({
                message: "Chưa có rạp nào",
                data: theaters
            })
        }

        return res.status(200).json({
            message: `Đang có ${theaters.length} rạp`,
            data: theaters
        })
    } catch (error) {
        console.log("Lỗi BE lấy danh sách các rạp: ");
        return res.status(500).json({
            message: "Không thế lấy danh sách -- lỗi Server (BE)",
            error: error.message
        })
    }
}

exports.edit = async (req, res) => {
    try {
        // Tìm được model Rạp --- Theater để Edit (Từ FE -> BE)
        const { id } = req.params

        const {
            iName,
            iAddress
        } = req.body

        if (!iName && !iAddress) {
            return res.status(400).json({ message: "Không có dữ liệu nào để cập nhật!" });
        }

        const theaterToEdit = await MovieTheater.findByIdAndUpdate(
            id, 
            {
                name: iName,
                address: iAddress
            }, {
                new: true
            }
        )

        if (!theaterToEdit) {
            return res.status(404).json({ message: "Không tìm thấy rạp này trong hệ thống!" });
        }

        return res.status(200).json({
            message: "Đã cập nhập thành công !!!",
            data: theaterToEdit
        })
        // Tìm trong mongo

        // Trả về Fe
    } catch (error) {
        console.log("Lỗi BE sửa rạp: ");
        return res.status(500).json({
            message: "Không thể sửa rạp này !!! -- lỗi Server (BE)",
            error: error.message
        })
    }
}

exports.delete =  async (req, res) => {
    try {
        const { id } = req.params

        await MovieTheater.deleteOne({ _id: id});

        return res.status(204).json({
            message: "Đã xoá thành công"
        })
        // Tìm trong mongo
    } catch (error) {
        console.log("Lỗi BE xoá rạp: ");
        return res.status(500).json({
            message: "Không thể xoá rạp này !!! -- lỗi Server (BE)",
            error: error.message
        })
    }
}
