import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import axios from 'axios';
import HomePage from './components/HomePage';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          Accept: 'application/json'
        }
      })
        .then(res => {
          setProfile(res.data);
          sendTokenToBackend(user.access_token);
        })
        .catch(err => console.log(err));
    }
  }, [user]);

  const sendTokenToBackend = (token) => {
    // Your backend authentication logic here
  };

  const logOut = () => {
    googleLogout();
    setProfile(null);
    setUser(null);
    // Your backend logout logic here
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={
          profile ? (
            <div>
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
          ) : (
            <Navigate to="/" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
