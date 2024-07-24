import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log('Login Success:', codeResponse);
            navigate('/dashboard');
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    return (
        <div>
            <h1>Welcome to Our App</h1>
            <button onClick={() => login()}>Sign in with Google 🚀</button>
        </div>
    );
};

export default HomePage;