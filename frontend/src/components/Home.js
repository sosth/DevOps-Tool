import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaArrowRight } from 'react-icons/fa';

const AuthenticatedHome = ({ profile, logOut }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  const viewProfile = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-[#191919] min-h-screen flex flex-col text-white">
      <header className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold">DEVO<span className="text-yellow-500">SPACE</span></h1>
        <div className="relative">
          <FaUserCircle 
            className="text-gray-300 text-2xl cursor-pointer" 
            onClick={() => setShowUserMenu(!showUserMenu)} 
          />
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#252525] rounded-md shadow-lg py-1">
              <a href="#" onClick={viewProfile} className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333333]">Profile</a>
              <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333333]">Logout</a>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow flex items-center px-8 py-12">
        <div className="w-1/2 pr-8">
          <button className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-8 flex items-center">
            Explore our Features <FaArrowRight className="ml-2" />
          </button>
          <h1 className="text-5xl font-bold mb-4">
            Welcome back, <span className="text-yellow-500">{profile.name}</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Continue innovating with DevOps. Access your profile to view your information and manage your account.
          </p>
          <button onClick={viewProfile} className="bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-semibold flex items-center">
            View Profile <FaArrowRight className="ml-2" />
          </button>
        </div>
        <div className="w-1/2">
          {/* You can add an illustration or any other content here */}
        </div>
      </main>
    </div>
  );
}

export default AuthenticatedHome;