import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import ForbiddenPage from '../modules/User/pages/ForbiddenPage';

const AdminRoute = () => {
    const { user } = useAuth();

    // 1. Kiểm tra đăng nhập
    // Nếu chưa có user -> Đá về trang chủ (hoặc trang login tùy bạn)
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // 2. Kiểm tra quyền Admin
    // Nếu role không phải admin -> Hiện trang 403
    if (user.role !== 'admin') {
        return <ForbiddenPage />;
    }

    // 3. Nếu thỏa mãn tất cả -> Cho phép hiển thị nội dung bên trong (Outlet)
    return <Outlet />;
};

export default AdminRoute;