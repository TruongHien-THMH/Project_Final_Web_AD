const User = require("../../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 
const { sendEmail } = require("../../controllers/Services/emailServices"); 

// --- 1. ĐĂNG KÝ (Có gửi mail Welcome) ---
exports.register = async (req, res) => {
    try {
        const { fullname, email, password, phone } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email đã tồn tại!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ fullname, email, password: hashedPassword, phone });

        // Gửi mail chào mừng
        sendEmail(email, "Chào mừng đến với VNUK Cinema! 🎉", `
            <h3>Xin chào ${fullname},</h3>
            <p>Tài khoản của bạn đã được tạo thành công.</p>
            <p>Hãy truy cập website để đặt vé ngay hôm nay!</p>
        `);

        return res.status(201).json({
            message: "Đăng ký thành công!",
            data: { id: newUser._id, email: newUser.email, fullname: newUser.fullname }
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

// --- 2. ĐĂNG NHẬP (Có gửi mail cảnh báo) ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });

        // Gửi mail thông báo đăng nhập (Tùy chọn)
        sendEmail(email, "Thông báo đăng nhập mới 🛡️", `
            <p>Tài khoản của bạn vừa đăng nhập vào lúc ${new Date().toLocaleString('vi-VN')}.</p>
            <p>Nếu không phải là bạn, vui lòng đổi mật khẩu ngay.</p>
        `);

        return res.status(200).json({
            message: "Đăng nhập thành công!",
            data: { token, user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role, avatar: user.avatar } }
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

// --- 3. QUÊN MẬT KHẨU ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email không tồn tại" });

        // Tạo token reset
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phút
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; // Link Frontend

        await sendEmail(email, "Yêu cầu đặt lại mật khẩu 🔑", `
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Click vào link dưới đây để tiếp tục:</p>
            <a href="${resetUrl}" style="background:#e11d48;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Đặt lại mật khẩu</a>
            <p>Link hết hạn sau 10 phút.</p>
        `);

        res.status(200).json({ message: "Đã gửi email hướng dẫn đặt lại mật khẩu!" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

// --- 4. ĐẶT LẠI MẬT KHẨU (RESET) ---
exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        
        // Tìm user có token khớp và chưa hết hạn
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

        // Hash mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Xóa token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại." });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};