import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

const GooglePanel = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const handleLoginSuccess = (googleUser) => {
        const idToken = googleUser.getAuthResponse().id_token;
        const googleEmail = googleUser.profileObj.email;
    
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
                console.log('Backend authentication successful:', data.user);
                localStorage.setItem('idToken', idToken);
                localStorage.setItem('googleEmail', googleEmail);
                setUserData(data.user);
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
