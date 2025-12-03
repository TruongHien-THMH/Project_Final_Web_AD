import React from 'react'
import { Clock, LayoutTemplate } from 'lucide-react';

export default function RoomStatus({ theaters, loading }) {
  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 w-full animate-pulse h-64 flex items-center justify-center">
         <span className="text-gray-500">Loading status...</span>
      </div>
    );
  }

  if (theaters.length === 0) {
    return (
      <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 w-full text-center flex flex-col items-center">
         <LayoutTemplate size={48} className="text-gray-600 mb-4"/>
         <h3 className="text-xl font-bold text-white mb-2">No Room Data</h3>
         <p className="text-gray-400">Please create a theater to monitor live room status.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-700 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-white">Live Room Status</h2>
        <div className="flex gap-3 bg-gray-900 px-3 py-2 rounded-lg border border-gray-700">
           <span className="flex items-center gap-1.5 text-xs text-gray-300 font-medium">
             <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> Available
           </span>
           <span className="flex items-center gap-1.5 text-xs text-gray-300 font-medium">
             <span className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span> Busy
           </span>
        </div>
      </div>

      {/* Grid Responsive: Mobile 1 cột, Tablet 2 cột, Desktop lớn 3 cột */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {theaters.map((theater) => (
          <div key={theater._id} className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
            {/* Header Rạp */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700/50">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-rose-500 font-bold border border-gray-600 shadow-inner">
                 {theater.name.charAt(0)}
               </div>
               <div className="overflow-hidden">
                 <h3 className="text-white font-bold truncate">{theater.name}</h3>
                 <p className="text-xs text-gray-400">{theater.hallCount} Rooms Active</p>
               </div>
            </div>

            {/* List Phòng */}
            <div className="space-y-3">
              {Array.from({ length: Math.min(theater.hallCount, 4) }).map((_, idx) => (
                <div key={idx} className="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between items-center relative overflow-hidden group">
                  {/* Status Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${idx % 2 === 0 ? 'bg-rose-500' : 'bg-green-500'}`}></div>
                  
                  <div className="pl-3">
                    <p className="text-gray-300 text-sm font-medium">Cinema {idx + 1}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Standard</p>
                  </div>

                  {/* Mock Status Data */}
                  {idx % 2 === 0 ? (
                    <div className="text-right">
                      <p className="text-rose-400 text-sm font-bold truncate max-w-[80px]">Mai</p>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400">
                        <Clock size={10}/> 19:00
                      </div>
                    </div>
                  ) : (
                    <div className="text-right">
                       <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">Empty</span>
                    </div>
                  )}
                </div>
              ))}
              
              {theater.hallCount > 4 && (
                <button className="w-full py-2 text-xs text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-700">
                  + {theater.hallCount - 4} more rooms
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
