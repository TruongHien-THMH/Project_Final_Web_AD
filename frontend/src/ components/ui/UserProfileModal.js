import React, { useState, useEffect } from 'react';
import API_USER from '../../api/User/api.user';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const UserProfileModal = ({ isOpen, onClose }) => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        avatar: ''
    });
    const [loading, setLoading] = useState(false);

    // Load dữ liệu khi mở modal
    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                fullname: user.fullname || '',
                email: user.email || '', // Email thường không cho sửa
                phone: user.phone || '',
                avatar: user.avatar || ''
            });
        }
    }, [isOpen, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await API_USER.put('/profile', formData);
            if (res.data.success) {
                toast.success("Cập nhật thông tin thành công!");
                
                // Cập nhật lại Context & LocalStorage
                const updatedUser = { ...user, ...res.data.data };
                const token = localStorage.getItem('token');
                login(updatedUser, token); // Gọi hàm login của Context để update state
                
                onClose();
            }
        } catch (error) {
            toast.error("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Hồ Sơ Cá Nhân</h2>

                {/* Avatar Preview */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full border-2 border-rose-500 overflow-hidden">
                        <img 
                            src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.fullname}`} 
                            alt="Avatar" className="w-full h-full object-cover" 
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Email (Không thể đổi)</label>
                        <input type="text" value={formData.email} disabled className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Họ và tên</label>
                        <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-rose-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Số điện thoại</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-rose-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Link Avatar</label>
                        <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-rose-500 outline-none" placeholder="https://..." />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full mt-8 py-3 bg-rose-600 hover:bg-rose-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-rose-900/40"
                >
                    {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
            </div>
        </div>
    );
};

export default UserProfileModal;