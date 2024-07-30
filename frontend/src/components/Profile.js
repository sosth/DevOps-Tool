// Profile.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const { profile } = location.state;

  return (
    <div className="bg-[#191919] min-h-screen flex flex-col items-center justify-center text-white">
      <h2 className="text-3xl font-bold mb-4">User Profile</h2>
      <img src={profile.picture} alt="user profile" className="w-24 h-24 rounded-full mb-4" />
      <h3 className="text-xl mb-2">Name: {profile.name}</h3>
      <p className="mb-1">Email: {profile.email}</p>
      <p className="mb-1">ID: {profile.id}</p>
      <p className="mb-1">First Name: {profile.given_name}</p>
      <p className="mb-1">Last Name: {profile.family_name}</p>
      <p className="mb-1">Locale: {profile.locale}</p>
      <p className="mb-1">Verified: {profile.verified_email ? "Yes" : "No"}</p>
      <p className="mb-4">Domain: {profile.hd}</p>
    </div>
  );
}

export default Profile;
