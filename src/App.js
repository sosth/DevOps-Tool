import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SalesforceAuthButton from './components/SalesforceAuthButton';
import Home from './components/Home';
import DeploymentsPage from './components/DeploymentsPage';
import OrganizationPage from './components/OrganizationPage';
import Navbar from './components/Navbar';

const HomeWithToken = ({ accessToken }) => {
  return <Home accessToken={accessToken} />;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Access the state from the current location
  const { accessToken } = location.state || {};

  // Function to handle Home button click
  const handleHomeClick = () => {
    // Navigate to '/home' with the current accessToken in the state
    navigate('/home', { state: { accessToken } });
  };

  // Show Navbar unless we are on the root path
  const shouldDisplayNavbar = location.pathname !== '/';

  return (
    <div>
      {shouldDisplayNavbar && <Navbar onHomeClick={handleHomeClick} />}
      <Routes>
        <Route path="/" element={<SalesforceAuthButton />} />
        <Route path="/home" element={<HomeWithToken accessToken={accessToken} />} />
        <Route path="/deployments" element={<DeploymentsPage />} />
        <Route path="/organization" element={<OrganizationPage />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
