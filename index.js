import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app';

ReactDOM.render(
    <GoogleOAuthProvider clientId="1089760997462-176kp1tfghagho1rp91ir4t1bbn2ucrf.apps.googleusercontent.com">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>,
    document.getElementById('root')
);