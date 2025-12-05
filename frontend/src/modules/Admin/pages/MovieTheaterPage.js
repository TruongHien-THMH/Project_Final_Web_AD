import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react'; // Import icon cần thiết

import TheaterForm from '../ui/TheaterForm';
import TheaterListWidget from '../ui/TheaterListWidget';
import RoomStatus from '../ui/RoomStatus';
import API_ADMIN_MOVIE_THEATER from '../../../api/Admin/api.admin.movie.theater';

export default function MovieTheaterPage() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTheater, setSelectedTheater] = useState(null);
  
  const [showModal, setShowModal] = useState(false);

  const fetchTheaters = async () => {
    setLoading(true);
    try {
      const res = await API_ADMIN_MOVIE_THEATER.get('/');
      // console.log("Dữ liệu nhận được từ API: ", res.data);
      setTheaters(res.data.data); 
    } catch (error) {
      console.error("Load failed", error);
      setTimeout(() => { 
         setTheaters([]); 
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (theater) => {
      // Tạm thời alert, sau này bạn sẽ set state để mở Modal Edit
      alert(`Edit function for: ${theater.name}\n(Mentor note: Reuse the Modal form with pre-filled data here)`);
      // Logic gợi ý: 
      setSelectedTheater(theater); 
      // setShowModal(true);
      setShowModal(true);
  }

  const handleAddNewClick = () => {
    
    setSelectedTheater(null);
    setShowModal(true);
  }

  useEffect(() => {
    fetchTheaters();
  }, []);

  // console.log("Sau khi set theaters",theaters);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 pb-20 relative">

      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-rose-500 mb-2">Theater Manager</h1>
          <p className="text-gray-400 text-sm md:text-base">Monitor status, manage rooms and layouts.</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              {/* Dữ liệu ảo */}
              <p className="text-xl font-bold text-white">12:30 PM</p> 
              <p className="text-gray-500 text-sm">Monday, 27 Nov 2025</p>
            </div>

            <button 
              onClick={handleAddNewClick}
              className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-rose-900/30 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <Plus size={20} strokeWidth={3} />
              <span>Add Theater</span>
            </button>
        </div>
      </header>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-12">
          {/* Truyền theaters.data hoặc theaters tùy API trả về, dùng optional chaining cho an toàn */}
          <TheaterListWidget 
            theaters={theaters?.data || theaters} 
            loading={loading}
            onRefresh={fetchTheaters} // Để Widget gọi khi xóa xong
            onEditClick={handleEditClick} // Để Widget gọi khi bấm nút Edit
          />
        </div>

        <div className="lg:col-span-12 mt-2">
          <RoomStatus theaters={theaters?.data || theaters} loading={loading} />
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800/50">
              <h2 className="text-2xl font-bold text-white" >{selectedTheater ? "Edit Form" : "Add new Form"}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <TheaterForm 
                initialData={selectedTheater} // Truyền dữ liệu rạp cần sửa (nếu có)
                onSuccess={() => {
                    setShowModal(false);
                    fetchTheaters();
                }}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}