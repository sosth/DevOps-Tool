import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async codeResponse => {
      setUser(codeResponse);
      const profileResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`);
      setProfile(profileResponse.data);
      
      // Send user data to backend
      await axios.post('/api/google/save-user', {
        id: profileResponse.data.id,
        email: profileResponse.data.email,
        firstName: profileResponse.data.given_name,
        lastName: profileResponse.data.family_name,
        googleLogin: true,
      });
    },
    onError: error => console.log('Login Failed:', error),
  });

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div>
      <h2>React Google Login</h2>
      {profile ? (
        <div>
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
        <button onClick={login}>Login with Google</button>
      )}
    </div>
  );
}

export default App;
