import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ profile, logOut }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  return (
    <div className="bg-[#191919] min-h-screen flex flex-col items-center justify-center text-white">
      <h2 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h2>
      <img src={profile.picture} alt="user profile" className="w-24 h-24 rounded-full mb-4"/>
      <h3 className="text-xl mb-2">Welcome, {profile.name}</h3>
      <p className="mb-1">Email: {profile.email}</p>
      <p className="mb-1">ID: {profile.id}</p>
      <p className="mb-1">First Name: {profile.given_name}</p>
      <p className="mb-1">Last Name: {profile.family_name}</p>
      <p className="mb-1">Locale: {profile.locale}</p>
      <p className="mb-1">Verified: {profile.verified_email ? "Yes" : "No"}</p>
      <p className="mb-4">Domain: {profile.hd}</p>
      <button onClick={handleLogout} className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-semibold">
        Logout
      </button>
    </div>
  );
}

export default Dashboard;