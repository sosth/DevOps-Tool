import React from 'react';

const HomePage = ({ login }) => {
    return (
        <div>
            <h1>Welcome to Our App</h1>
            <button onClick={() => login()}>Sign in with Google 🚀</button>
        </div>
    );
};

export default HomePage;