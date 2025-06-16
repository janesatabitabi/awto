import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import Navbar from '../../components/Navbar';
import Filter from '../../components/Filter';
import CatalogBox from '../../components/CatalogBox';

import '../../styles/UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Navbar hideCreateAccount={true} showLogout={true} handleLogout={handleLogout} />

      <div className="user-dashboard-container">
        <h1>Welcome to Joven Tired napo kami huhu Shop</h1>
        <p>Select your vehicle and browse fitment-matching products.</p>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ flex: 1 }}>
            <Filter />
          </div>
          <div style={{ flex: 3 }}>
            <CatalogBox />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
