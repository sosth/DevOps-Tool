// src/components/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <Link to="/login">Login with Google</Link>
        </div>
    );
};

export default HomePage;
