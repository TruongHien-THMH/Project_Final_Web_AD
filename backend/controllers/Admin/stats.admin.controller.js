const User = require("../../models/User.model");
const Ticket = require("../../models/Ticket.model");

exports.getDashboardStats = async (req, res) => {
    try {
        // --- 1. SỐ LIỆU TỔNG QUAN (Total Cards) ---
        const totalUsers = await User.countDocuments();
        
        // Chỉ tính vé đã thanh toán ('paid')
        const paidTickets = await Ticket.find({ status: 'paid' });
        const totalTickets = paidTickets.length;
        
        // Tính tổng doanh thu
        const totalRevenue = paidTickets.reduce((acc, ticket) => acc + ticket.totalPrice, 0);

        // --- 2. SỐ LIỆU THEO THÁNG (Cho Biểu Đồ) ---
        // Hàm helper để group theo tháng
        const getMonthlyStats = async (Model, matchQuery = {}) => {
            return await Model.aggregate([
                { $match: matchQuery }, // Lọc (ví dụ: chỉ lấy vé paid)
                {
                    $group: {
                        _id: { $month: "$createdAt" }, // Nhóm theo tháng (1-12)
                        count: { $sum: 1 },            // Đếm số lượng
                        total: { $sum: "$totalPrice" } // (Dùng cho vé) Tính tổng tiền
                    }
                },
                { $sort: { _id: 1 } } // Sắp xếp từ tháng 1 -> 12
            ]);
        };

        const userStatsRaw = await getMonthlyStats(User);
        const ticketStatsRaw = await getMonthlyStats(Ticket, { status: 'paid' });

        // Chuẩn hóa dữ liệu ra mảng 12 tháng (Mặc định là 0 nếu tháng đó không có data)
        const processChartData = (rawData, field = 'count') => {
            const data = new Array(12).fill(0);
            rawData.forEach(item => {
                // item._id là tháng (1-12), mảng bắt đầu từ 0 nên trừ 1
                data[item._id - 1] = item[field] || item.count;
            });
            return data;
        };

        const monthlyUsers = processChartData(userStatsRaw);
        const monthlyTickets = processChartData(ticketStatsRaw);
        const monthlyRevenue = processChartData(ticketStatsRaw, 'total');

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalTickets,
                totalRevenue,
                chartData: {
                    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    users: monthlyUsers,     // Mảng số user theo tháng
                    tickets: monthlyTickets, // Mảng số vé theo tháng
                    revenue: monthlyRevenue  // Mảng doanh thu theo tháng
                }
            }
        });

    } catch (error) {
        console.error("Stats Error:", error);
        return res.status(500).json({ message: "Lỗi lấy thống kê dashboard" });
    }
};