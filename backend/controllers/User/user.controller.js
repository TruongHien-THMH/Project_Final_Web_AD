const User = require("../../models/User.model");
const Ticket = require("../../models/Ticket.model");

// 1. Xem thông tin cá nhân (Profile)
exports.getUserProfile = async (req, res) => {
    try {
        // req.user.id lấy từ middleware verifyToken
        const user = await User.findById(req.user.id).select("-password"); // Không trả về password
        
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

// 2. Cập nhật thông tin cá nhân
exports.updateUserProfile = async (req, res) => {
    try {
        const { fullname, phone, avatar } = req.body;
        
        // Tìm và update
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { 
                fullname, 
                phone, 
                avatar 
            },
            { new: true } // Trả về data mới sau khi update
        ).select("-password");

        res.status(200).json({ 
            success: true, 
            message: "Cập nhật thành công!", 
            data: user 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
    }
};

// 3. Xem lịch sử đặt vé (My Booking)
exports.getMyBookings = async (req, res) => {
    try {
        // Tìm vé của user này, populate ngược lại để lấy tên phim, rạp
        const tickets = await Ticket.find({ userId: req.user.id })
            .populate({
                path: 'scheduleId',
                select: 'time_start', // Lấy giờ chiếu
                populate: [
                    { path: 'movieId', select: 'title poster_path' }, // Lấy tên phim, ảnh
                    { 
                        path: 'roomId', 
                        select: 'name',
                        populate: { path: 'movie_theater_id', select: 'name address' } // Lấy tên rạp
                    }
                ]
            })
            .sort({ createdAt: -1 }); // Vé mới nhất lên đầu

        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy lịch sử vé", error: error.message });
    }
};