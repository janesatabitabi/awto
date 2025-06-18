import React, { useState } from 'react';
import '../styles/LandingPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginSection from '../components/LoginSection';
import Fitment from '../components/Fitment'; // ✅ Separated Fitment component

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  return (
    <>
      <Navbar user={user} onLoginClick={() => setShowLogin(true)} />
      {showLogin && (
        <LoginSection
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      <main className="main-content">
        {/* ✅ Fitment now imported and separated */}
        <Fitment />

        {/* Brands */}
        <section id="brand" className="section brand-section">
          <h2>Brand</h2>
          <p>Showcase brands here...</p>
        </section>

        {/* Services */}
        <section id="services" className="section services-section">
          <h2>Services</h2>
          <p>List your services here...</p>
        </section>

        {/* About */}
        <section id="about" className="section about-section">
          <h2>About Us</h2>
          <p>Information about Joven Tire Enterprise...</p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LandingPage;
