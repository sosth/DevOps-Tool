// Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSearch } from 'react-icons/fa';

const Dashboard = ({ profile, logOut }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  const viewProfile = () => {
    navigate('/profile', { state: { profile } });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white">
        {/* Sidebar content */}
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Home</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input type="text" placeholder="Search..." className="bg-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              <FaSearch className="absolute right-3 top-3 text-gray-500" />
            </div>
            <FaBell className="text-gray-500 text-xl cursor-pointer" />
            <div className="relative">
              <FaUserCircle className="text-gray-500 text-2xl cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)} />
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <a href="#" onClick={viewProfile} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome back, {profile.name}</h2>
          {/* Dashboard content */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
