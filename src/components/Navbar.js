// Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="https://essentials.copado.com/app/assets/images/Logo_CopadoEssentials.png" alt="Copado Logo" className="navbar-logo" />
        <span className="navbar-title">ESSENTIALS</span>
      </div>
      <ul className="navbar-links">
        <li><NavLink to="/home" activeClassName="active" exact>Home</NavLink></li>
        <li><NavLink to="/ci-jobs" activeClassName="active">CI Jobs</NavLink></li>
        <li><NavLink to="/work-items" activeClassName="active">Work Items</NavLink></li>
        <li><NavLink to="/deployments" activeClassName="active">Deployments</NavLink></li>
        <li><NavLink to="/organization" activeClassName="active">Organization</NavLink></li>
        <li><NavLink to="/history" activeClassName="active">History</NavLink></li>
      </ul>
      <div className="navbar-icons">
        <span className="navbar-icon"><i className="bell-icon"></i></span>
        <span className="navbar-icon"><i className="user-icon"></i></span>
      </div>
    </nav>
  );
};

export default Navbar;
