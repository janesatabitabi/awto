import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import Navbar from '../../components/Navbar'; // ✅ corrected path
import "../../styles/UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>User Dashboard</h1>
        <p>Welcome, valued customer! Here’s your dashboard.</p>
        <button onClick={handleLogout} style={{ marginTop: '1rem' }}>Logout</button>
      </div>
    </>
  );
};

export default UserDashboard;
