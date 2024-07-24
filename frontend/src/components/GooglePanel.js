import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GooglePanel = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const handleLoginSuccess = (googleUser) => {
        const idToken = googleUser.getAuthResponse().id_token;
        const googleEmail = googleUser.profileObj.email;
    
        fetch('/api/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: googleUser.profileObj.email,
              given_name: googleUser.profileObj.givenName,
              family_name: googleUser.profileObj.familyName,
              id: googleUser.profileObj.googleId
            }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.email) {  // Check for a property that should exist in the user object
              console.log('Backend authentication successful:', data);
              localStorage.setItem('idToken', idToken);
              localStorage.setItem('googleEmail', data.email);
              setUserData(data);
              navigate(props.onLogin);
            } else {
              console.error('Backend authentication failed');
              handleLoginFailure(new Error('Backend authentication failed'));
            }
          })
        .catch(error => {
            console.error('Error during backend authentication:', error);
            handleLoginFailure(error);
        });
    };

    const handleLoginFailure = (error) => {
        console.error('Google Login failed:', error);
    };

    const handleLogoutSuccess = () => {
        console.log('Logged out');
    
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
    
        localStorage.removeItem('idToken');
        localStorage.removeItem('googleEmail');
        setUserData(null);
    
        navigate(props.onLogout);
    };

    const googleEmail = localStorage.getItem('googleEmail');

    return (
        <div>
            {!googleEmail ? (
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Login with Google"
                    onSuccess={handleLoginSuccess}
                    onFailure={handleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                />
            ) : (
                <div>
                    <p>Logged in as {googleEmail}</p>
                    <GoogleLogout
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        buttonText="Logout with Google"
                        onLogoutSuccess={handleLogoutSuccess}
                    />
                    {userData && (
                        <div>
                            <h3>User Data:</h3>
                            <pre>{JSON.stringify(userData, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GooglePanel;
