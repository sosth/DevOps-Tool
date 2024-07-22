import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: codeResponse => setUser(codeResponse),
    onError: error => console.log('Login Failed:', error),
  });

  useEffect(() => {
    if (user) {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`)
        .then(res => {
          setProfile(res.data);
          // Send the profile data to your backend, including the Google ID
          axios.post('/api/auth/google', {
            email: res.data.email,
            given_name: res.data.given_name,
            family_name: res.data.family_name,
            id: res.data.id // Google ID
          })
          .catch(err => console.log('Error saving user data:', err));
        })
        .catch(err => console.log(err));
    }
  }, [user]);
  

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
