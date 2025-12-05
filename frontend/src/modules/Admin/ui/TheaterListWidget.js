import React, { useState } from 'react';
import { 
  MapPin, MonitorPlay, ChevronRight, Inbox, 
  Trash2, Edit, ChevronDown, Calendar, Info 
} from 'lucide-react';
import API_ADMIN_MOVIE_THEATER from '../../../api/Admin/api.admin.movie.theater'; // Import để gọi API xóa

const TheaterListWidget = ({ theaters, loading, onRefresh, onEditClick }) => {
  
  // State lưu ID của rạp đang được mở rộng (null = không mở cái nào)
  const [expandedId, setExpandedId] = useState(null);

  // Hàm xử lý toggle (Bấm vào thì mở, bấm lại thì đóng)
  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Hàm xử lý Xóa
  const handleDelete = async (id, name, e) => {
    e.stopPropagation(); // QUAN TRỌNG: Ngăn không cho sự kiện click lan ra cha (không mở rộng dòng)
    
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await API_ADMIN_MOVIE_THEATER.delete(`/delete/${id}`); 
        alert("Deleted successfully!");
        if (onRefresh) onRefresh(); // Load lại danh sách
      } catch (error) {
        alert("Delete failed: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // Hàm xử lý Sửa
  const handleEdit = (theater, e) => {
    e.stopPropagation(); // Ngăn mở rộng dòng
    // Gọi callback để Parent xử lý (Mở modal edit)
    if (onEditClick) {
      onEditClick(theater);
    } 
  };

  const SkeletonItem = () => (
    <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 animate-pulse mb-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-full">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-800 rounded w-3/4"></div>
        </div>
        <div className="h-8 w-12 bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-700 h-full flex flex-col min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Your Theaters</h2>
        {!loading && (
          <span className="bg-gray-700 text-rose-400 px-3 py-1 rounded-full text-sm font-semibold">
            {theaters.length}
          </span>
        )}
      </div>

      <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[500px]">
        {loading ? (
          <>
            <SkeletonItem /> <SkeletonItem /> <SkeletonItem />
          </>
        ) : theaters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
            <div className="bg-gray-900 p-4 rounded-full mb-3">
              <Inbox size={32} className="text-gray-600" />
            </div>
            <p>No theaters found.</p>
          </div>
        ) : (
          // --- LIST ITEMS ---
          theaters.map((theater) => {
            const isExpanded = expandedId === theater._id;

            return (
              <div 
                key={theater._id} 
                className={`mb-3 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded 
                    ? 'bg-gray-800 border-rose-500/50 shadow-lg shadow-rose-900/10' 
                    : 'bg-gray-900 border-gray-700 hover:border-gray-500'
                }`}
              >
                {/* 1. HEADER ROW (Click để mở rộng) */}
                <div 
                  onClick={() => toggleExpand(theater._id)}
                  className="p-4 cursor-pointer flex justify-between items-start gap-3"
                >
                  {/* Left Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                       <h3 className={`font-bold transition-colors ${isExpanded ? 'text-rose-400' : 'text-white'}`}>
                        {theater.name}
                      </h3>
                      {isExpanded && <ChevronDown size={16} className="text-rose-500"/>}
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                      <MapPin size={14} />
                      <span className="truncate max-w-[150px] md:max-w-[200px]">{theater.address}</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    {/* Badge Số phòng */}
                    <div className="bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-600 flex items-center gap-2 mr-2">
                      <MonitorPlay size={14} className="text-rose-500"/>
                      <span className="text-white font-bold text-xs">{theater.hallCount}</span>
                    </div>

                    {/* Action Buttons (Edit & Delete) */}
                    <button 
                      onClick={(e) => handleEdit(theater, e)}
                      className="p-2 bg-gray-800 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-lg transition-colors border border-gray-700 hover:border-blue-500/50"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button 
                      onClick={(e) => handleDelete(theater._id, theater.name, e)}
                      className="p-2 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-gray-700 hover:border-red-500/50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* 2. EXPANDED DETAIL (Slide Down) */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-4 pt-0 border-t border-gray-700/50 bg-gray-800/50">
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        {/* Cột 1 */}
                        <div className="space-y-2">
                            <p className="text-gray-500 flex items-center gap-2">
                                <Calendar size={14}/> Created At:
                            </p>
                            <p className="text-white font-medium pl-6">
                                {new Date(theater.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                        {/* Cột 2 */}
                        <div className="space-y-2">
                            <p className="text-gray-500 flex items-center gap-2">
                                <Info size={14}/> System ID:
                            </p>
                            <p className="text-gray-400 font-mono text-xs pl-6">
                                {theater._id}
                            </p>
                        </div>
                    </div>

                    {/* Footer của phần mở rộng */}
                    <div className="mt-4 pt-3 border-t border-gray-700/30 flex justify-end">
                       <button 
                          onClick={(e) => { e.stopPropagation(); alert('Feature: Manage Rooms Layout'); }}
                          className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                       >
                          Manage Room Layouts <ChevronRight size={14}/>
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TheaterListWidget;