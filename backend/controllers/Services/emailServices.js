const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Cấu hình Transporter (Dùng Gmail App Password)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

// Hàm gửi Email chung (Dùng cho Auth: Đăng ký, Quên pass...)
const sendEmail = async (to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: '"VNUK Cinema" <no-reply@vnukcinema.com>',
            to: to,
            subject: subject,
            html: htmlContent
        });
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

// Hàm gửi Vé (Đã có sẵn, giữ nguyên logic nhưng dùng transporter thật)
const sendTicketEmail = async (email, ticketInfo) => {
    try {
        const mailOptions = {
            from: '"VNUK Cinema" <no-reply@vnukcinema.com>',
            to: email,
            subject: `✅ Vé xem phim: ${ticketInfo.movieName}`,
            html: `
                <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #e11d48; text-align: center;">Đặt Vé Thành Công!</h2>
                    <p>Cảm ơn bạn đã đặt vé. Dưới đây là thông tin chi tiết:</p>
                    <div style="background-color: #f9f9f9; padding: 15px; margin-top: 20px;">
                        <p><strong>Phim:</strong> ${ticketInfo.movieName}</p>
                        <p><strong>Rạp:</strong> ${ticketInfo.theaterName}</p>
                        <p><strong>Suất chiếu:</strong> ${ticketInfo.time} - ${ticketInfo.date}</p>
                        <p><strong>Ghế:</strong> ${ticketInfo.seatNames}</p>
                        <p><strong>Tổng tiền:</strong> <span style="color: #e11d48; font-weight: bold;">${ticketInfo.totalPrice}</span></p>
                    </div>
                    <p style="text-align: center; margin-top: 20px; color: #888;">Mã vé: <strong>${ticketInfo.ticketId}</strong></p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Ticket email sent to ${email}`);
    } catch (error) {
        console.error("❌ Error sending ticket email:", error);
    }
};

module.exports = { sendEmail, sendTicketEmail };