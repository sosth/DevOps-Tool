import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Dashboard = ({ profile, logOut }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/home');
  };

  return (
    <div className="bg-[#191919] min-h-screen flex flex-col text-white">
      <header className="bg-[#252525] shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">DEVO<span className="text-yellow-500">SPACE</span></h1>
        <button onClick={goBack} className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center px-8 py-12">
        <h2 className="text-3xl font-bold mb-4">Your Profile</h2>
        <img src={profile.picture} alt="user profile" className="w-24 h-24 rounded-full mb-4"/>
        <h3 className="text-xl mb-2">Welcome, {profile.name}</h3>
        <p className="mb-1">Email: {profile.email}</p>
        <p className="mb-1">ID: {profile.id}</p>
        <p className="mb-1">First Name: {profile.given_name}</p>
        <p className="mb-1">Last Name: {profile.family_name}</p>
        <p className="mb-1">Locale: {profile.locale}</p>
        <p className="mb-1">Verified: {profile.verified_email ? "Yes" : "No"}</p>
        <p className="mb-4">Domain: {profile.hd}</p>
      </main>
    </div>
  );
}

export default Dashboard;