import React, { useState } from 'react';
import { FaHome, FaCog, FaClipboardList, FaRocket, FaUsers, FaHistory, FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const DeploymentPage = ({ profile, logOut }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  const deployments = [
    {
      deployment: 'Comparison pti to J15',
      owner: 'mohammed jouad',
      source: 'pfichrono',
      target: 'jouad15',
      lastStatus: '',
      createdDate: '29/06/23',
      lastViewed: '29/06/23'
    },
    // Add more deployment objects here
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white relative">
        <div className="p-4 text-2xl font-bold">
          DEVO<span className="text-yellow-500">SPACE</span>
        </div>
        <div className="border-b border-white mx-4 mb-4"></div>
        <nav className="mt-4 px-4">
          <SidebarLink to="/" icon={FaHome} text="Home" />
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
          <div className="bg-white shadow rounded-lg mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deployment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Viewed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deployments.map((deployment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deployment.deployment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deployment.owner}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deployment.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deployment.target}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deployment.lastStatus}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deployment.createdDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deployment.lastViewed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
