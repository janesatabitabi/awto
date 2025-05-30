import React from 'react';
import '../styles/LandingPage.css';

import Navbar from '../components/Navbar';
import LoginSection from '../components/LoginSection';

const LandingPage = () => {
  const handleExplore = () => {
    alert('Explore button clicked!');
  };

  return (
    <>
      <Navbar />
      <main className="main-content">
        <section className="left-section">
          <div className="tire-box">
            <h2>Find a tire match for your vehicle</h2>
            <button className="explore-button" onClick={handleExplore}>
              Explore
            </button>
          </div>
        </section>

        <section className="right-section">
          <LoginSection />
        </section>
      </main>
    </>
  );
};

export default LandingPage;
