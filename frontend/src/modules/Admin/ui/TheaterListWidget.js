import React from 'react';
import { MapPin, MonitorPlay, ChevronRight, Inbox, SearchX } from 'lucide-react';

const TheaterListWidget = ({ theaters, loading }) => {

  const SkeletonItem = () => (
    <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-full">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-800 rounded w-3/4"></div>
        </div>
        <div className="h-8 w-12 bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  );

  // console.log("Data type: ", theaters);

  return (
    <div className="bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-700 h-full flex flex-col min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Your Theaters</h2>
        {!loading && (
          <span className="bg-gray-700 text-rose-400 px-3 py-1 rounded-full text-sm font-semibold">
            {theaters.length}
          </span>
        )}
      </div>

      <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1 max-h-[400px]">
        {loading ? (
          <>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </>
        ) : theaters.length === 0 ? (
          // Empty State UI
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
            <div className="bg-gray-900 p-4 rounded-full mb-3">
              <Inbox size={32} className="text-gray-600" />
            </div>
            <p>No theaters found.</p>
            <p className="text-xs mt-1">Create your first theater to start.</p>
          </div>
        ) : (

          theaters.map((theater, index) => (
            <div key={theater._id || index} className="bg-gray-900 p-4 rounded-2xl border border-gray-700 hover:border-rose-500/50 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold group-hover:text-rose-400 transition-colors">
                    {theater.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <MapPin size={14} />
                    <span className="truncate max-w-[150px] md:max-w-[200px]">{theater.address}</span>
                  </div>
                </div>
                <div className="bg-gray-800 px-3 py-1 rounded-lg border border-gray-600 inline-flex items-center gap-2">
                  <MonitorPlay size={14} className="text-rose-500"/>
                  <span className="text-white font-bold">{theater.hallCount}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700 text-center">
        <button className="text-rose-400 text-sm font-medium hover:text-rose-300 flex items-center justify-center gap-1 w-full">
          View All Analytics <ChevronRight size={16}/>
        </button>
      </div>
    </div>
  );
};

export default TheaterListWidget;