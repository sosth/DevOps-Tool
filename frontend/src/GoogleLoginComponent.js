import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleLoginComponent = () => {
  const [loginData, setLoginData] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
    setLoginData(response);
    setLoginError(null); // Clear any previous errors
  };

  const handleLoginFailure = (response) => {
    console.log('Login Failed:', response);
    setLoginData(null); // Clear any previous success data
    if (response.error === "popup_closed_by_user") {
      setLoginError("The popup was closed by the user before completing the sign-in.");
    } else {
      setLoginError("An error occurred during the login process.");
    }
  };

  return (
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
        cookiePolicy={'single_host_origin'}
        scope="profile email" // Add necessary scopes here
      />
      {loginData && (
        <div>
          <h2>Login Successful:</h2>
          <pre>{JSON.stringify(loginData, null, 2)}</pre>
        </div>
      )}
      {loginError && (
        <div>
          <h2>Login Failed:</h2>
          <p>{loginError}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginComponent;
