const Schedule = require("../../models/Schedule.model");
const Ticket = require("../../models/Ticket.model");
const Movie = require("../../models/Movies"); // Nhớ lấy RUNTIMEEEEE 
const { sendTicketEmail } = require('../../controllers/Services/emailServices');

exports.createBooking = async (req, res) => {
    try {
        const { scheduleId, seatNames, totalPrice, paymentMethod } = req.body;

        // 1. Kiểm tra lịch chiếu
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) return res.status(404).json({ message: "Lịch chiếu không tồn tại" });

        // 2. Kiểm tra ghế đã bị đặt chưa (check cả booked và pending)
        const isTaken = seatNames.some(seat => 
            schedule.booked_seats.includes(seat) || schedule.pending_seats.includes(seat)
        );
        if (isTaken) {
            return res.status(400).json({ message: "Một số ghế đã có người chọn. Vui lòng chọn lại!" });
        }

        // 3. Tính thời gian hết hạn (Logic yêu cầu 3 & 4)
        const now = new Date();
        const showTime = new Date(schedule.time_start);
        let expireTime;

        if (paymentMethod === 'transfer') {
            // Chuyển khoản: Hết hạn sau 10 phút
            expireTime = new Date(now.getTime() + 10 * 60000);
        } else {
            // Tiền mặt: Hết hạn trước giờ chiếu 1 tiếng
            // Nếu đặt sát giờ (< 1 tiếng) -> Cho phép giữ 15 phút để chạy ra quầy
            const oneHourBeforeShow = new Date(showTime.getTime() - 60 * 60000);
            expireTime = oneHourBeforeShow > now ? oneHourBeforeShow : new Date(now.getTime() + 15 * 60000);
        }

        // 4. Cập nhật Schedule: Đưa ghế vào pending_seats
        schedule.pending_seats.push(...seatNames);
        await schedule.save();

        // 5. Tạo Ticket
        const newTicket = await Ticket.create({
            scheduleId,
            seatNames,
            totalPrice,
            paymentMethod,
            status: 'pending',
            expireAt: expireTime
        });

        return res.status(201).json({
            message: "Giữ chỗ thành công! Vui lòng thanh toán.",
            data: {
                ticket: newTicket,
                expireInSeconds: Math.floor((expireTime - now) / 1000) // Trả về số giây để FE đếm ngược
            }
        });

    } catch (error) {
        console.error("Booking Error:", error);
        return res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

// Xác nhận thanh toán (Chuyển pending -> booked)
exports.confirmPayment = async (req, res) => {
    try {
        const { ticketId, email } = req.body; // Nhận email từ FE

        // 1. Tìm vé & Populate đầy đủ thông tin để gửi mail
        const ticket = await Ticket.findById(ticketId).populate({
            path: 'scheduleId',
            populate: [
                { path: 'movieId' },
                { 
                    path: 'roomId',
                    populate: { path: 'movie_theater_id'} 
                }
            ]
        });

        if (!ticket) return res.status(404).json({ message: "Vé không tồn tại" });
        if (ticket.status === 'paid') return res.status(400).json({ message: "Vé này đã thanh toán rồi!" });

        // 2. Cập nhật trạng thái Vé
        ticket.status = 'paid';
        await ticket.save();

        // 3. Cập nhật trạng thái Ghế trong Schedule (Xóa pending -> Thêm booked)
        const schedule = await Schedule.findById(ticket.scheduleId._id);
        if (schedule) {
            // Xóa khỏi pending
            schedule.pending_seats = schedule.pending_seats.filter(seat => !ticket.seatNames.includes(seat));
            // Thêm vào booked (nếu chưa có)
            ticket.seatNames.forEach(seat => {
                if (!schedule.booked_seats.includes(seat)) {
                    schedule.booked_seats.push(seat);
                }
            });
            await schedule.save();
        }

        // 4. Chuẩn bị dữ liệu gửi Email
        const movieInfo = ticket.scheduleId.movieId;
        const roomInfo = ticket.scheduleId.roomId;
        const theaterInfo = roomInfo.movie_theater_id;
        
        const emailData = {
            movieName: movieInfo.title || movieInfo.original_title || "Phim chưa cập nhật tên", 
            theaterName: theaterInfo ? theaterInfo.name : "Rạp chưa cập nhật",
            
            // Format Thời gian
            time: new Date(ticket.scheduleId.time_start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
            date: new Date(ticket.scheduleId.time_start).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            
            seatNames: ticket.seatNames.join(", "),
            
            // Format Tiền tệ
            totalPrice: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ticket.totalPrice),
            ticketId: ticket._id
        };

        // 5. Gửi mail (Chạy ngầm, không await để phản hồi nhanh cho user)
        if (email) {
            sendTicketEmail(email, emailData); 
        }

        return res.status(200).json({ message: "Thanh toán thành công! Vé đã được gửi tới email." });

    } catch (error) {
        console.error("Lỗi Confirm Payment:", error);
        return res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
}