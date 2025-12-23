import React, { useState } from 'react';
import API_ADMIN_MOVIE from '../../../api/Admin/api.admin.movie';

const AddMoviePage = () => {
  // --- STATE CHỈ CÒN THÔNG TIN PHIM ---
  const [movieData, setMovieData] = useState({
    title: '', 
    original_title: '', 
    overview: '', 
    runtime: 120, // Default 120 phút
    poster_path: '', 
    backdrop_path: '', 
    genres: [], 
    release_date: ''
  });
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HANDLE SUBMIT: CHỈ TẠO PHIM ---
  const handleSubmit = async () => {
      // Validate cơ bản
      if(!movieData.title || !movieData.runtime) {
          return alert("Vui lòng nhập Tên phim và Thời lượng!");
      }

      setIsSubmitting(true);
      try {
          console.log("💾 Đang tạo phim...");
          
          const res = await API_ADMIN_MOVIE.post('/', movieData);
          
          // Thành công
          const newMovie = res.data.data;
          alert(`🎉 Tạo phim thành công: "${newMovie.title}"\n(Bạn hãy qua trang Schedule để xếp lịch cho phim này nhé!)`);

          // Reset Form
          setMovieData({
              title: '', original_title: '', overview: '', runtime: 120, 
              poster_path: '', backdrop_path: '', genres: [], release_date: ''
          });

      } catch (error) {
          console.error("Lỗi Submit:", error);
          const msg = error.response?.data?.message || error.message;
          alert("Thất bại: " + msg);
      } finally {
          setIsSubmitting(false);
      }
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex justify-center">
        
        {/* CONTAINER GIỮA MÀN HÌNH */}
        <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 h-fit">
            
            <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
                <h2 className="text-3xl font-bold text-rose-500">Thêm Phim Mới</h2>
                <div className="px-3 py-1 bg-gray-700 rounded text-xs text-gray-400">
                    Step 1: Create Movie Data
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
                <div className="space-y-5">
                    {/* Tên Phim */}
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-semibold">Tên Phim (VN) <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full bg-gray-700 p-3 rounded-lg focus:border-rose-500 border border-gray-600 outline-none transition-colors" 
                            value={movieData.title} onChange={e => setMovieData({...movieData, title: e.target.value})}
                            placeholder="VD: Đào, Phở và Piano"
                        />
                    </div>

                    {/* Tên Gốc */}
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-semibold">Tên Gốc (Original Title)</label>
                        <input type="text" className="w-full bg-gray-700 p-3 rounded-lg focus:border-rose-500 border border-gray-600 outline-none transition-colors" 
                            value={movieData.original_title} onChange={e => setMovieData({...movieData, original_title: e.target.value})}
                            placeholder="VD: Dao, Pho va Piano"
                        />
                    </div>
                    
                    {/* Thời lượng & Ngày Chiếu */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-400 text-sm mb-1 font-semibold">Thời lượng (Phút) <span className="text-red-500">*</span></label>
                            <input type="number" className="w-full bg-gray-700 p-3 rounded-lg focus:border-rose-500 border border-gray-600 outline-none font-bold" 
                                value={movieData.runtime} onChange={e => setMovieData({...movieData, runtime: Number(e.target.value)})}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-400 text-sm mb-1 font-semibold">Ngày Khởi Chiếu</label>
                            <input type="date" className="w-full bg-gray-700 p-3 rounded-lg focus:border-rose-500 border border-gray-600 outline-none" 
                                 value={movieData.release_date} onChange={e => setMovieData({...movieData, release_date: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: HÌNH ẢNH & MÔ TẢ */}
                <div className="space-y-5">
                    {/* Poster */}
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-semibold">Link Poster (Ảnh Dọc)</label>
                        <input type="text" className="w-full bg-gray-700 p-3 rounded-lg outline-none border border-gray-600 focus:border-rose-500" 
                            value={movieData.poster_path} onChange={e => setMovieData({...movieData, poster_path: e.target.value})}
                            placeholder="https://image.tmdb.org/t/p/..."
                        />
                    </div>

                    {/* Backdrop */}
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-semibold">Link Backdrop (Ảnh Ngang - Optional)</label>
                        <input type="text" className="w-full bg-gray-700 p-3 rounded-lg outline-none border border-gray-600 focus:border-rose-500" 
                            value={movieData.backdrop_path} onChange={e => setMovieData({...movieData, backdrop_path: e.target.value})}
                            placeholder="https://image.tmdb.org/t/p/..."
                        />
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-semibold">Mô tả nội dung</label>
                        <textarea rows="4" className="w-full bg-gray-700 p-3 rounded-lg outline-none border border-gray-600 focus:border-rose-500 resize-none"
                            value={movieData.overview} onChange={e => setMovieData({...movieData, overview: e.target.value})}
                            placeholder="Nhập tóm tắt nội dung phim..."
                        ></textarea>
                    </div>
                </div>

            </div>

            {/* NÚT SUBMIT */}
            <div className="mt-10 pt-6 border-t border-gray-700">
                <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition flex items-center justify-center gap-3
                        ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white hover:shadow-rose-900/30'}
                    `}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tạo Phim Mới
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
  )
}

export default AddMoviePage;