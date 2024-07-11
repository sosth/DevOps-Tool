// src/GoogleRedirect.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleRedirect = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleResponse = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        try {
          const response = await axios.get(`https://testdevtospace3-41cb63a6d5d7.herokuapp.com/users/googleback?token=${token}`);
          console.log('Google login response:', response.data);

          if (response.status === 200) {
            // Handle successful login and redirect
            navigate('/dashboard');
          } else {
            setError('Failed to log in with Google');
          }
        } catch (error) {
          console.error('Error during Google login:', error);
          setError('Failed to log in with Google');
        }
      } else {
        setError('No token found in the URL');
      }
    };

    handleGoogleResponse();
  }, [navigate]);

  return (
    <div>
      {error ? (
        <div>
          <h2>{error}</h2>
        </div>
      ) : (
        <h2>Processing Google login...</h2>
      )}
    </div>
  );
};

export default GoogleRedirect;
