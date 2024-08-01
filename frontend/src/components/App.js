import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

function App() {
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      try {
        const result = await axios.post('/api/google/login', {
          code: codeResponse.code
        });
        setProfile(result.data.userInfo);
      } catch (error) {
        console.error('Error during login process:', error);
      }
    },
    flow: 'auth-code',
    scope: 'openid profile email',
    onError: (error) => console.log('Login Failed:', error)
  });

  const logOut = () => {
    googleLogout();
    setProfile(null);
    fetch('/api/google/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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