import React, { createContext, useContext, useState, useEffect } from 'react';
import API_AUTH from '../api/Service/auth.service';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Giả lập user (Sau này nối API sẽ lưu user thật vào đây)
    const [user, setUser] = useState(null); 
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
    const [loading, setLoading] = useState(true);

    // --- 1. CHECK LOGIN KHI F5 TRANG ---
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
                
            } catch (error) {
                console.error("Lỗi parse user", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    // --- 2. HÀM LOGIN (GỌI API) ---
    const loginAction = async (formData) => {
        try {
            const res = await API_AUTH.post('/login', formData);
            
            // Lưu info vào State và LocalStorage
            const { token, user } = res.data.data;
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setIsAuthModalOpen(false); // Đóng modal
            showToast(`Chào mừng trở lại, ${user.fullname}!`, "success");
            return { success: true, role: user.role};
        } catch (error) {
            const msg = error.response?.data?.message || "Đăng nhập thất bại";
            showToast(msg, "error");
            return { success: false, message: msg };
        }
    };

    // --- 3. HÀM REGISTER (GỌI API) ---
    const registerAction = async (formData) => {
        try {
            // Gọi API đăng ký
            await API_AUTH.post('/register', formData);
            
            // Đăng ký xong -> Tự động đăng nhập luôn cho tiện
            return await loginAction({ 
                email: formData.email, 
                password: formData.password 
            });
        } catch (error) {
            const msg = error.response?.data?.message || "Đăng ký thất bại";
            showToast(msg, "error");
            return { success: false, message: msg };
        }
    };

    // --- 4. HÀM LOGOUT ---
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showToast("Đã đăng xuất", "info");
    };

    // --- CÁC HÀM UI (MODAL, TOAST) ---
    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loginAction,     
            registerAction,  
            logout, 
            isAuthModalOpen, 
            openAuthModal, 
            closeAuthModal,
            toast,
            showToast
        }}>
            {children}
            
            {/* TOAST COMPONENT (Nằm toàn cục) */}
            {toast.show && (
                <div className={`fixed top-5 right-5 z-[70] px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-right duration-300
                    ${toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : 
                      toast.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' : 
                      'bg-gray-800 border-gray-600 text-white'}`}>
                    <span className="text-xl">{toast.type === 'success' ? '🎉' : '⚠️'}</span>
                    <span className="font-semibold">{toast.message}</span>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);