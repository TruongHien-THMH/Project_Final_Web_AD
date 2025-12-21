import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthModal = () => {
    const { isAuthModalOpen, closeAuthModal, loginAction, registerAction } = useAuth();
    const navigate = useNavigate();
    
    const [isLoginView, setIsLoginView] = useState(true); // Toggle Login/Register
    const [isLoading, setIsLoading] = useState(false);    // Trạng thái Loading

    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        email: '', 
        password: '', 
        fullname: '', 
        phone: ''
    });

    if (!isAuthModalOpen) return null;

    // --- XỬ LÝ KHI BẤM SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Bật loading

        let result;
        if(isLoginView) {
            // Login: Chỉ cần email, password
            result = await loginAction({ 
                email: formData.email, 
                password: formData.password 
            });
        } else {
            // Register: Cần full thông tin
            result = await registerAction(formData);
        }

        setIsLoading(false); // Tắt loading

        // --- KIỂM TRA ROLE ĐỂ ĐIỀU HƯỚNG ---
        if (result && result.success) {
            // Nếu là Admin -> Vào thẳng Dashboard
            if (result.role === 'admin') {
                navigate('/admin');
            } 
            // Nếu là User -> Ở yên trang hiện tại (để tiếp tục đặt vé)
        }
    };

    // Hàm cập nhật input nhanh gọn
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={closeAuthModal}></div>

            {/* Modal Content */}
            <div className="relative bg-[#0d0d0d] w-full max-w-4xl h-[600px] rounded-3xl overflow-hidden shadow-2xl flex border border-gray-800 animate-in zoom-in-95 duration-300">
                
                {/* Nút đóng */}
                <button onClick={closeAuthModal} className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-rose-600 rounded-full text-white transition-all">✕</button>

                {/* CỘT TRÁI: ẢNH ẢNH (Cyberpunk / VNUK Style) */}
                <div className="hidden md:block w-1/2 h-full relative">
                    <img 
                        src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop" 
                        // Thay link trên bằng ảnh VNUK của bạn
                        alt="Background" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-10 left-8 text-white">
                        <h2 className="text-4xl font-bold mb-2 text-rose-500">Welcome to VNUK Cinema</h2>
                        <p className="text-gray-300 opacity-80">Trải nghiệm điện ảnh đỉnh cao.</p>
                    </div>
                </div>

                {/* 1 BG cổ điển hơn: 
                    {/* CỘT TRÁI: ẢNH ARTWORK */}

                {/* <div className="hidden md:block w-1/2 h-full relative">
                    <img 
                        src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop" 
                        alt="Cinema Art" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute bottom-10 left-8 text-white z-10">
                        <h2 className="text-4xl font-bold mb-2 text-rose-500 drop-shadow-lg">VNUK CINEMA</h2>
                        <p className="text-gray-300 opacity-90 font-light tracking-wide">Enter the world of dreams.</p>
                    </div>
                </div> */}


                {/* CỘT PHẢI: FORM */}
                <div className="w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-center bg-[#121212] relative">
                    
                    <div className="max-w-sm mx-auto w-full">
                        <h3 className="text-3xl font-bold text-white mb-2">
                            {isLoginView ? 'Welcome Back!' : 'Create Account'}
                        </h3>
                        <p className="text-gray-400 mb-8 text-sm">
                            {isLoginView ? 'Please sign in to continue booking' : 'Join us to experience the best movies'}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* REGISTER FIELDS (Chỉ hiện khi đăng ký) */}
                            {!isLoginView && (
                                <div className="animate-in slide-in-from-right fade-in duration-300 space-y-4">
                                    <input 
                                        name="fullname"
                                        type="text" 
                                        placeholder="Full Name"
                                        required
                                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-5 py-3.5 text-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-gray-600"
                                        onChange={handleChange}
                                    />
                                    <input 
                                        name="phone"
                                        type="tel" 
                                        placeholder="Phone Number"
                                        required
                                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-5 py-3.5 text-white focus:border-rose-500 focus:outline-none transition-all placeholder:text-gray-600"
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {/* COMMON FIELDS */}
                            <input 
                                name="email"
                                type="email" 
                                placeholder="Email Address"
                                required
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-5 py-3.5 text-white focus:border-rose-500 focus:outline-none transition-all placeholder:text-gray-600"
                                onChange={handleChange}
                            />
                            
                            <input 
                                name="password"
                                type="password" 
                                placeholder="Password"
                                required
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-5 py-3.5 text-white focus:border-rose-500 focus:outline-none transition-all placeholder:text-gray-600"
                                onChange={handleChange}
                            />

                            {/* Forgot Password Link (Chỉ hiện khi Login) */}
                            {isLoginView && (
                                <div className="flex justify-end">
                                    <button type="button" className="text-xs text-gray-500 hover:text-rose-500 transition-colors">
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            {/* SUBMIT BUTTON */}
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 mt-6 shadow-lg shadow-rose-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    isLoginView ? 'Sign In' : 'Sign Up'
                                )}
                            </button>
                        </form>

                        {/* Switch Toggle */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-400 text-sm">
                                {isLoginView ? "Don't have an account?" : "Already have an account?"}
                                <button 
                                    onClick={() => setIsLoginView(!isLoginView)}
                                    className="ml-2 text-rose-500 font-bold hover:underline"
                                >
                                    {isLoginView ? 'Sign Up' : 'Login'}
                                </button>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;