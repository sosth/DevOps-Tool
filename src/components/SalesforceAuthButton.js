import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SalesforceAuthButton.css';

const SalesforceAuthButton = () => {
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAccessToken = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:3001/getAccessToken');
      console.log('Fetched Access Token:', data.accessToken);  // Debugging line
      setAccessToken(data.accessToken);
      navigate('/home', { state: { accessToken: data.accessToken } });
    } catch (error) {
      console.error('Error fetching access token:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleAuth = () => {
    if (!accessToken) {
      fetchAccessToken();
    } else {
      navigate('/home', { state: { accessToken } });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <img src="https://essentials.copado.com/app/assets/images/Logo_CopadoEssentials.png" alt="Copado Essentials" className="logo" />
        <h1>Deploy Effortlessly</h1>
        <button onClick={handleAuth} disabled={loading} className="auth-button">
          <img src="https://1000logos.net/wp-content/uploads/2017/08/Salesforce-Logo-1999.png" alt="Salesforce" className="salesforce-logo" />
          {loading ? 'Connecting...' : 'Sign in with Salesforce (via developer or production org)'}
        </button>
        <p>Your login is only used to create your Copado profile. No applications will be installed on your Salesforce org.</p>
        <div className="terms">
          By signing in, you agree to our <a href="/terms-of-service">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>.
        </div>
        <div className="demo">
          <span>Not ready to sign up?</span>
          <button className="demo-button">Schedule a demo</button>
        </div>
      </div>
    </div>
  );
};

export default SalesforceAuthButton;
