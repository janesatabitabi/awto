import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { FiBox, FiHome, FiLogOut } from 'react-icons/fi';
import '../../styles/staff-styles/StaffLayout.css';

const StaffLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <h1 className="logo">AWTO Staff</h1>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/staff-dashboard" className="nav-link">
            <FiHome className="icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/staff-inventory" className="nav-link">
            <FiBox className="icon" />
            <span>Inventory</span>
          </NavLink>
          <NavLink to="/staff-sales" className="nav-link">
            <FiBox className="icon" />
            <span>Sales</span>
          </NavLink>
          <NavLink to="/staff-reservation" className="nav-link">
            <FiBox className="icon" />
            <span>Reservation</span>
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="logout-button">
          <FiLogOut className="icon" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default StaffLayout;
