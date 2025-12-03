// src/admin/components/AdminSidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin' }, // Index route
  { name: 'Add Shows', path: '/admin/add-shows' },
  { name: 'List Shows', path: '/admin/list-shows' },
  { name: 'List Bookings', path: '/admin/list-bookings' },
  { name: 'Schedules', path: '/admin/schedules'},
  { name: 'MovieTheaterPage', path: '/admin/movie_theater'}

];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 sticky top-0">
      
      {/* Thông tin người dùng */}
      <div className="flex items-center space-x-3 mb-10 mt-2">
        {/*  */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-600">
          <img src="https://i.pravatar.cc/150?img=1" alt="Richard Sanford" className="w-full h-full object-cover" />
        </div>
        <p className="font-semibold text-lg">Richard Sanford</p>
      </div>

      {/* Điều hướng */}
      <nav className="flex flex-col space-y-2">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/admin'} // Dùng 'end' cho Dashboard để tránh trùng khớp với các path khác
            className={({ isActive }) => 
              `flex items-center p-3 rounded-lg text-sm transition-colors duration-200 
               ${isActive 
                 ? 'bg-rose-800 text-white shadow-lg shadow-rose-900/50' 
                 : 'text-gray-400 hover:bg-gray-800 hover:text-white'
               }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;