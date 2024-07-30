import React from 'react';
import illustration from './images/dev.PNG';

const HomePage = () => {
  return (
    <div className="bg-black min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-black text-white w-64 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">DEVOSPACE</h1>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="text-yellow-500">Home</a>
          <a href="#">CI Jobs</a>
          <a href="#">Work Items</a>
          <a href="#">Deployments</a>
          <a href="#">Organization</a>
          <a href="#">History</a>
        </nav>
        <div className="mt-auto">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-bold">Upgrade to Pro</h2>
            <p className="text-sm mt-2">Unlock all features and get unlimited access to our support team.</p>
            <button className="bg-yellow-500 text-black mt-4 px-4 py-2 rounded">Upgrade</button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 bg-white p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Welcome back, quiam mn</h2>
          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Search ..." className="px-4 py-2 border rounded"/>
            <button className="bg-gray-200 px-4 py-2 rounded">Select Widgets</button>
            <button className="bg-gray-200 px-4 py-2 rounded">Refresh</button>
            <div className="bg-gray-200 p-2 rounded-full">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM7 17c-.552 0-1-.447-1-1s.448-1 1-1 1 .447 1 1S7.552 17 7 17zM12 17c-.552 0-1-.447-1-1s.448-1 1-1 1 .447 1 1S12.552 17 12 17zM17 17c-.552 0-1-.447-1-1s.448-1 1-1 1 .447 1 1S17.552 17 17 17zM12 12c-.552 0-1-.447-1-1s.448-1 1-1 1 .447 1 1S12.552 12 12 12zM12 7c-.552 0-1-.447-1-1s.448-1 1-1 1 .447 1 1S12.552 7 12 7z"/>
              </svg>
            </div>
          </div>
        </header>
        <main>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Activity</h3>
            <div className="flex space-x-4">
              <button className="bg-gray-200 px-4 py-2 rounded">Team Activity</button>
              <button className="bg-gray-800 text-white px-4 py-2 rounded">My Activity</button>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-4">
            <div className="flex">
              {/* Upcoming */}
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-4">Upcoming</h4>
                <img src={illustration} alt="Upcoming activity" className="w-full h-auto"/>
              </div>
              {/* Completed */}
              <div className="flex-1 ml-8">
                <h4 className="text-lg font-bold mb-4">Completed</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded">
                    <div>
                      <p className="font-bold">Target org deployment</p>
                      <p className="text-sm">Deploy - Dev Copado Demo - Default.org</p>
                    </div>
                    <div className="text-sm text-gray-600">02/06/2024 at 08:22 AM</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded">
                    <div>
                      <p className="font-bold">Target org deployment</p>
                      <p className="text-sm">Deploy - Dev Copado Demo - Default.org</p>
                    </div>
                    <div className="text-sm text-gray-600">02/06/2024 at 08:22 AM</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded">
                    <div>
                      <p className="font-bold">Target org deployment</p>
                      <p className="text-sm">Deploy - Dev Copado Demo - Default.org</p>
                    </div>
                    <div className="text-sm text-gray-600">02/06/2024 at 08:22 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
