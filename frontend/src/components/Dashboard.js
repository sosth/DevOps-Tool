import React, { useState } from 'react';
import { FaHome, FaCog, FaClipboardList, FaRocket, FaUsers, FaHistory, FaBell, FaSearch, FaUserCircle, FaSyncAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import illustration from './images/home.PNG';

const Dashboard = ({ profile, logOut }) => {
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
        <div className="border-b border-gray-700 mx-4 mb-4"></div>
        <nav className="mt-4">
          <SidebarLink icon={FaHome} text="Home" active />
          <SidebarLink icon={FaCog} text="CI Jobs" />
          <SidebarLink icon={FaClipboardList} text="Work Items" />
          <SidebarLink icon={FaRocket} text="Deployments" />
          <SidebarLink icon={FaUsers} text="Organization" />
          <SidebarLink icon={FaHistory} text="History" />
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
            <h2 className="text-xl text-white font-semibold">Home</h2>
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

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome back, {profile.name}</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Activity</h3>
              <div className="flex items-center">
                <select className="mr-2 p-2 border rounded-md border-gray-700 text-gray-700">
                  <option>Select Widgets</option>
                </select>
                <button className="flex items-center bg-white px-2 py-2 rounded-md border border-gray-700 text-gray-700">
                  <FaSyncAlt className="mr-2 text-gray-700" />
                  Refresh
                </button>
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <button className="bg-gray-200 px-4 py-2 rounded">Team Activity</button>
              <button className="bg-black text-white px-4 py-2 rounded">My Activity</button>
            </div>
            <div className="flex">
              <div className="w-1/2 pr-4">
                <h4 className="font-semibold mb-2">Upcoming</h4>
                <img src={illustration} alt="No upcoming activities" className="w-full" />
              </div>
              <div className="w-1/2 pl-4">
                <h4 className="font-semibold mb-2">Completed</h4>
                <div className="space-y-4">
                  {/* You can map through completed activities here */}
                  {[1, 2, 3, 4].map((activity, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4 shadow-sm flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="text-yellow-500">
                          <FaRocket />
                        </div>
                        <div>
                          <div className="font-semibold">Target org deployment</div>
                          <div className="text-sm text-gray-500">Deploy • Dev Copado Demo → Default.org • {profile.name}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        02/06/2024 at 08:22 AM
                      </div>
                    </div>
                  ))}
                  {/* Repeat for more activities */}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon: Icon, text, active }) => (
  <a href="#" className={`flex items-center space-x-2 p-4 rounded ${active ? 'bg-yellow-500 text-black' : 'hover:bg-gray-800'}`}>
    <Icon className={`text-lg ${active ? 'text-black' : 'text-white'}`} />
    <span className={active ? 'font-semibold text-black' : 'text-white'}>{text}</span>
  </a>
);

export default Dashboard;
