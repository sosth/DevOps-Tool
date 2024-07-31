import React from 'react';
import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Deployments = ({ profile, logOut }) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl text-white font-semibold">Deployments</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-800 text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
          <FaBell className="text-white text-xl cursor-pointer" />
          <div className="relative">
            <FaUserCircle
              className="text-white text-2xl cursor-pointer"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Deployments Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold mb-4">Deployments</h1>
        <p>This is the Deployments page. Add your deployment-related content here.</p>
        {/* Add more deployment-related components and logic here */}
      </main>
    </div>
  );
};

export default Deployments;