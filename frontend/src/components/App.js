import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import HomePage from './components/HomePage';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: codeResponse => setUser(codeResponse),
    onError: error => console.log('Login Failed:', error),
  });

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
          // Here you can send the token to your backend for verification
          // Similar to what you did in GooglePanel.js
          sendTokenToBackend(user.access_token);
        })
        .catch(err => console.log(err));
    }
  }, [user]);

  const sendTokenToBackend = (token) => {
    // Send the token to your backend
    fetch('/api/google/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Backend authentication successful:', data.userId);
          // You might want to store some session information here
        } else {
          console.error('Backend authentication failed');
        }
      })
      .catch(error => {
        console.error('Error during backend authentication:', error);
      });
  };

  const logOut = () => {
    googleLogout();
    setProfile(null);
    setUser(null);
    // Inform backend about logout
    fetch('/api/google/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Backend logout successful');
        } else {
          console.error('Backend logout failed');
        }
      })
      .catch(error => {
        console.error('Error during backend logout:', error);
      });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          profile ? (
            <Navigate to="/dashboard" />
          ) : (
            <div>
              <h2>Login</h2>
              <button onClick={login}>Sign in with Google 🚀 </button>
            </div>
          )
        } />
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
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;