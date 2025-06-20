import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import Navbar from '../../components/Navbar';
import Filter from '../../components/Filter';
import CatalogBox from '../../components/CatalogBox';
import '../../styles/UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFilters = location.state || {};
  const [filters, setFilters] = useState(initialFilters);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <Navbar hideCreateAccount={true} showLogout={true} handleLogout={handleLogout} />

      <div className="user-dashboard-container">
        <p className="dashboard-intro">
          Select your vehicle and browse fitment-matching products.
        </p>

        <div className="dashboard-content">
          <div className="filter-panel">
            <Filter onChange={setFilters} />
          </div>
          <div className="catalog-panel">
            <CatalogBox filters={filters} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
