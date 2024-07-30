import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = ({ profile, logOut }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  return (
    <div className="bg-[#191919] min-h-screen flex flex-col text-white">
      <header className="bg-black p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">DEVOSPACE</h1>
        <div className="relative">
          <img 
            src={profile.picture} 
            alt="user profile" 
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-4">Welcome back, {profile.given_name}</h2>
        <div className="grid grid-cols-2 gap-4">
          <section className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Activity</h3>
            <div className="flex justify-between mb-2">
              <span>Upcoming</span>
              <span>Completed</span>
            </div>
            {/* Add activity content here */}
          </section>
          {/* Add more sections as needed */}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;