import React from 'react';

const HeaderAdmin = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="h-16 w-full bg-gray-900/60 backdrop-blur-md border-b border-gray-800 flex justify-between items-center px-4 sticky top-0 z-30 shadow-sm">
      
      {/* Bên Trái: Nút Toggle + Title */}
      <div className="flex items-center gap-4">
        <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-400 hover:bg-rose-600 hover:text-white transition-all duration-200"
            title="Toggle Sidebar"
        >
            {/* Icon Menu Hamburger / Close */}
            {isSidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                </svg>
            )}
        </button>
        
        <h1 className="text-lg font-semibold text-white tracking-wide hidden sm:block">
            Dashboard
        </h1>
      </div>

      {/* Bên Phải: User Actions */}
      <div className="flex items-center space-x-4">
        {/* Nút Log Out */}
        <button className="bg-rose-600/90 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-900/40 text-white px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2">
            <span>Log Out</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
        </button>
      </div>
    </header>
  );
};

export default HeaderAdmin;