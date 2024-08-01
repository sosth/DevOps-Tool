// src/components/Profile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Profile = ({ profile, logOut }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">User Profile</h2>
        
        <div className="flex justify-center mb-6">
          <img src={profile.picture} alt="Profile" className="w-32 h-32 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField label="Full Name" value={profile.name} />
          <ProfileField label="First Name" value={profile.given_name} />
          <ProfileField label="Last Name" value={profile.family_name} />
          <ProfileField label="Email" value={profile.email} />
          {/* You can add more fields here if needed */}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold text-gray-600">{label}</h3>
    <p className="text-lg">{value}</p>
  </div>
);

export default Profile;