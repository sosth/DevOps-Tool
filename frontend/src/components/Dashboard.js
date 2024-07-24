import React from 'react';

const Dashboard = ({ profile, logOut }) => {
  return (
    <div className="bg-[#191919] min-h-screen flex flex-col items-center justify-center text-white">
      <h2>Welcome to Your Dashboard</h2>
              <img src={profile.picture} alt="user profile" />
              <h3>Welcome, {profile.name}</h3>
              <p>Email: {profile.email}</p>
              <p>ID: {profile.id}</p>
              <p>First Name: {profile.given_name}</p>
              <p>Last Name: {profile.family_name}</p>
              <p>Locale: {profile.locale}</p>
              <p>Verified: {profile.verified_email ? "Yes" : "No"}</p>
              <p>Domain: {profile.hd}</p>
              <button onClick={logOut}>Logout</button>
    </div>
  );
}

export default Dashboard;