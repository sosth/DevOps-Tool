import React, { useState } from 'react';
import { FaHome, FaCog, FaClipboardList, FaRocket, FaUsers, FaHistory, FaBell, FaSearch, FaUserCircle, FaFilter, FaPlus, FaInfoCircle, FaChevronRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const DeploymentPage = ({ profile, logOut }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white relative">
        <div className="p-4 text-2xl font-bold">
          DEVO<span className="text-yellow-500">SPACE</span>
        </div>
        <div className="border-b border-white mx-4 mb-4"></div>
        <nav className="mt-4 px-4">
          <SidebarLink to="/dashboard" icon={FaHome} text="Home" />
          <SidebarLink to="/ci-jobs" icon={FaCog} text="CI Jobs" />
          <SidebarLink to="/work-items" icon={FaClipboardList} text="Work Items" />
          <SidebarLink to="/deployments" icon={FaRocket} text="Deployments" active />
          <SidebarLink to="/organization" icon={FaUsers} text="Organization" />
          <SidebarLink to="/history" icon={FaHistory} text="History" />
        </nav>
        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
            <p className="text-sm mb-4">Unlock all features and get unlimited access to our support team.</p>
            <button className="bg-yellow-500 text-black px-4 py-2 rounded-full w-full">Upgrade</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
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
          {/* ... (rest of the Deployments content remains the same as in the previous response) ... */}
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon: Icon, text, active }) => (
  <Link to={to} className={`flex items-center space-x-2 p-4 rounded ${active ? 'bg-yellow-500 text-black' : 'hover:bg-gray-800'}`}>
    <Icon className={`text-lg ${active ? 'text-black' : 'text-white'}`} />
    <span className={active ? 'font-semibold text-black' : 'text-white'}>{text}</span>
  </Link>
);

export default DeploymentPage;