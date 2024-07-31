import React, { useState } from 'react';
import { FaBell, FaSearch, FaUserCircle, FaRocket, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Deployments = ({ profile, logOut }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  // Mock data for deployments
  const deployments = [
    { id: 1, name: 'Project Alpha', status: 'Completed', date: '2024-07-25' },
    { id: 2, name: 'Project Beta', status: 'In Progress', date: '2024-07-28' },
    { id: 3, name: 'Project Gamma', status: 'Failed', date: '2024-07-26' },
    { id: 4, name: 'Project Delta', status: 'Scheduled', date: '2024-08-01' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <FaCheck className="text-green-500" />;
      case 'In Progress':
        return <FaClock className="text-yellow-500" />;
      case 'Failed':
        return <FaTimes className="text-red-500" />;
      case 'Scheduled':
        return <FaRocket className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black shadow-md p-4 flex justify-between items-center">
        {/* ... (keep the existing header code) ... */}
      </header>

      {/* Deployments Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold mb-4">Deployments</h1>
        
        {/* Deployment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {['Total', 'Completed', 'In Progress', 'Failed'].map((stat) => (
            <div key={stat} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{stat}</h3>
              <p className="text-2xl font-bold">{Math.floor(Math.random() * 100)}</p>
            </div>
          ))}
        </div>

        {/* Deployments Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deployments.map((deployment) => (
                <tr key={deployment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{deployment.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(deployment.status)}
                      <span className="ml-2">{deployment.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{deployment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-indigo-600 hover:text-indigo-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Deployments;