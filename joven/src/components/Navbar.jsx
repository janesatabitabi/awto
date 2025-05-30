import React from 'react';
import { useNavigate } from 'react-router-dom';
import jovenLogo from '../assets/jovenlogo.png';
import '../styles/LandingPage.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="left-nav">
        <img src={jovenLogo} alt="Joven Tire Logo" className="logo" />
        <span className="brand-name">Joven Tire Enterprise</span>
      </div>
      <div className="right-nav">
        <a href="#home" className="nav-link">Home</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#services" className="nav-link">Services</a>
        <button className="create-account-button" onClick={() => navigate('/register')}>
          Create an account
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
