const Schedule = require("../../models/Schedule.model");
const Ticket = require("../../models/Ticket.model");
const Movie = require("../../models/Movies"); // Nhớ lấy RUNTIMEEEEE 

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
        const { ticketId } = req.body;
        
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return res.status(404).json({ message: "Vé không tồn tại" });

        if (ticket.status !== 'pending') {
            return res.status(400).json({ message: "Vé này đã được xử lý rồi!" });
        }

        // Cập nhật trạng thái Vé
        ticket.status = 'paid';
        await ticket.save();

        // Cập nhật trạng thái Ghế: pending -> booked
        const schedule = await Schedule.findById(ticket.scheduleId);
        
        // Xóa khỏi pending
        schedule.pending_seats = schedule.pending_seats.filter(seat => !ticket.seatNames.includes(seat));
        // Thêm vào booked
        schedule.booked_seats.push(...ticket.seatNames);
        
        await schedule.save();

        return res.status(200).json({ message: "Thanh toán thành công! Vé đã được xuất." });

    } catch (error) {
         return res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
}