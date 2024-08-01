import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log('Google Login Success:', codeResponse);
      sendCodeToBackend(codeResponse.code);
    },
    flow: 'auth-code',
    scope: 'openid profile email',
    onError: (error) => console.log('Login Failed:', error)
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
          console.log("Fetched profile data:", res.data);
          setProfile(res.data);
          sendTokenToBackend(user.access_token);
        })
        .catch(err => console.error("Error fetching profile:", err));
    }
  }, [user]);

  useEffect(() => {
    console.log("Current profile state:", profile);
  }, [profile]);

  const sendTokenToBackend = (tokenResponse) => {
    const idToken = tokenResponse.id_token; // Use the ID token, not the access token
    fetch('/api/google/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: idToken }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Backend authentication successful:', data.userId);
        } else {
          console.error('Backend authentication failed');
        }
      })
      .catch(error => {
        console.error('Error during backend authentication:', error);
      });
  };
  const sendCodeToBackend = (code) => {
    fetch('/api/google/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Backend authentication successful:', data.userId);
          // Here you might want to fetch the user profile or update the app state
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
        <Route path="/" element={
          profile ? <Navigate to="/dashboard" /> : <HomePage login={login} />
        } />
        <Route path="/dashboard" element={
          profile ? <Dashboard profile={profile} logOut={logOut} /> : <Navigate to="/" />
        } />
        <Route path="/profile" element={
          profile ? <Profile profile={profile} logOut={logOut} /> : <Navigate to="/" />
        } />
      </Routes>
    </Router>
  );
}

export default App;