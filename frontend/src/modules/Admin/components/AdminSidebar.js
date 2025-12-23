import React from 'react';
import { NavLink } from 'react-router-dom';

// --- NHÓM 1: CÁC TRANG HOẠT ĐỘNG ---
const activeLinks = [
  { 
      name: 'Dashboard', path: '/admin', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /> 
  },
  { 
      name: 'Add Movie', path: '/admin/add-movie',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> 
  },
  { 
      name: 'Schedules', path: '/admin/schedules',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  },
  { 
      name: 'Theaters', path: '/admin/movie_theater',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  }
];

// --- NHÓM 2: CÁC TRANG BẢO TRÌ ---
const maintenanceLinks = [
  { 
      name: 'Add Shows', path: '/admin/add-shows',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> // Đổi icon khác chút
  },
  { 
      name: 'List Shows', path: '/admin/list-shows',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
  },
  { 
      name: 'Bookings', path: '/admin/list-bookings',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v4.086c0 .698.503 1.3 1.187 1.412.868.14 1.565.895 1.565 1.789 0 .894-.698 1.649-1.565 1.789a1.353 1.353 0 00-1.187 1.412v4.086c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-4.086c0-.698-.503-1.3-1.187-1.412-.868-.14-1.565-.895-1.565-1.789 0-.894.698-1.649 1.565-1.789a1.352 1.352 0 001.187-1.412V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
  }
];


const SidebarLinkItem = ({ link, isOpen }) => (
    <NavLink
        to={link.path}
        className={({ isActive }) => 
            `flex items-center p-3 rounded-xl transition-all duration-200 group relative
            ${isActive 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }
            ${!isOpen ? 'justify-center' : ''} 
            `
        }
        title={!isOpen ? link.name : ''}
    >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0">
            {link.icon}
        </svg>
        <span className={`ml-3 font-medium whitespace-nowrap transition-all duration-200 ${!isOpen ? 'w-0 overflow-hidden opacity-0 ml-0' : 'w-auto opacity-100'}`}>
            {link.name}
        </span>
        {!isOpen && (
            <NavLink to={link.path} className={({isActive}) => isActive ? "absolute right-2 w-1.5 h-1.5 bg-white rounded-full" : "hidden"} />
        )}
    </NavLink>
);

const AdminSidebar = ({ isOpen }) => {
  return (
    <aside className="w-full h-full p-4 flex flex-col overflow-hidden">
      
      {/* USER INFO (Giữ nguyên code cũ) */}
      <div className={`flex items-center gap-3 mb-6 transition-all duration-300 ${!isOpen ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-rose-600 shrink-0 shadow-[0_0_15px_rgba(225,29,72,0.5)]">
          <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-full h-full object-cover" />
        </div>
        <div className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${!isOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
             <p className="font-bold text-sm text-white">Richard Sanford</p>
             <p className="text-xs text-rose-500">Administrator</p>
        </div>
      </div>

      <nav className="flex flex-col space-y-2 flex-1 overflow-y-auto custom-scrollbar">
        
        {/* --- 1. RENDER ACTIVE LINKS --- */}
        {activeLinks.map((link) => (
            <SidebarLinkItem key={link.name} link={link} isOpen={isOpen} />
        ))}

        {/* --- DÒNG KẺ PHÂN CÁCH (LINE) --- */}
        <div className={`py-4 flex items-center ${!isOpen ? 'justify-center' : ''}`}>
            {isOpen ? (
                <>
                    <div className="h-px bg-gray-700 flex-1"></div>
                    <span className="px-2 text-[10px] uppercase text-gray-500 font-bold tracking-wider">Maintenance</span>
                    <div className="h-px bg-gray-700 flex-1"></div>
                </>
            ) : (
                <div className="w-8 h-px bg-gray-700"></div>
            )}
        </div>

        {/* --- 2. RENDER MAINTENANCE LINKS --- */}
        {maintenanceLinks.map((link) => (
            <div key={link.name} className="relative group/maint">
                {/* Lớp phủ mờ để biểu thị đang bảo trì (Optional) */}
                <SidebarLinkItem link={link} isOpen={isOpen} />
                
                {/* Icon cờ lê nhỏ báo hiệu (Chỉ hiện khi mở sidebar) */}
                {isOpen && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M19 5.5a4.5 4.5 0 01-4.791 4.49c-.873-.055-1.808.128-2.368.8l-6.024 7.23a.75.75 0 01-1.064.096l-2.302-1.92a.75.75 0 01-.096-1.064l7.23-6.024c.672-.56 .855-1.495.8-2.368a4.5 4.5 0 118.615-1.24zM9 10a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        ))}

      </nav>

      {/* FOOTER (Giữ nguyên) */}
      <div className={`mt-auto pt-4 border-t border-gray-700 transition-all duration-300 ${!isOpen ? 'hidden' : 'block'}`}>
          <p className="text-xs text-gray-500 text-center">VNUK Cinema Admin v1.0</p>
      </div>

    </aside>
  );
};

export default AdminSidebar;