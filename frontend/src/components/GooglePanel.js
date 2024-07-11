import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

const GooglePanel = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const handleLoginSuccess = (googleUser) => {
        const idToken = googleUser.getAuthResponse().id_token;
        const googleEmail = googleUser.profileObj.email;

        console.log('The id_token is ' + idToken);
        console.log('User Data: ', JSON.stringify(googleUser, null, 2));

        localStorage.setItem('idToken', idToken);
        localStorage.setItem('googleEmail', googleEmail);
        setUserData(googleUser);

        navigate(props.onLogin);
    };

    const handleLoginFailure = (error) => {
        console.error('Google Login failed:', error);
    };

    const handleLogoutSuccess = () => {
        console.log('Logged out');

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
