const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Chưa đăng nhập!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token hết hạn hoặc không hợp lệ" });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        // Kiểm tra Role trong Token đã giải mã
        if (req.user && (req.user.role === 'admin' || req.user.isAdmin)) {
            next();
        } else {
            return res.status(403).json({ message: "Bạn không có quyền Admin!" });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };