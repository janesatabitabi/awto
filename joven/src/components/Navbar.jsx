import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import jovenLogo from '../assets/jovenlogo.png';
import '../styles/LandingPage.css';
import LoginSection from './LoginSection';

const Navbar = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // for mobile menu

  return (
    <>
      <nav className="navbar">
        <div className="left-nav" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src={jovenLogo} alt="Joven Tire Logo" className="logo" />
          <span className="brand-name">Joven Tire Enterprise</span>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>

        <div className={`right-nav ${menuOpen ? 'open' : ''}`}>
          <a href="#fitment" className="nav-link" onClick={() => setMenuOpen(false)}>Fitment</a>
          <a href="#brand" className="nav-link" onClick={() => setMenuOpen(false)}>Brand</a>
          <a href="#services" className="nav-link" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" className="nav-link" onClick={() => setMenuOpen(false)}>About</a>

          <button className="icon-button" title="Notifications">🔔</button>
          <button className="icon-button" title="My Selections">🛒 My Selections</button>
          <button className="create-account-button" onClick={() => {
            setShowLogin(true);
            setMenuOpen(false);
          }}>
            Account
          </button>
        </div>
      </nav>

      {showLogin && (
        <div className="login-popup-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={() => setShowLogin(false)}>✖</button>
            <LoginSection />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
