import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Public Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin-page/AdminDashboard';
import AdminSales from './pages/admin-page/Sales';
import AdminInventory from './pages/admin-page/Inventory';
import AdminStaffs from './pages/admin-page/Staffs';
import AdminReservations from './pages/admin-page/Reservations';
import AdminCustomers from './pages/admin-page/Customers';
import AdminSettings from './pages/admin-page/Settings';

// User Page
import UserDashboard from './pages/user-page/UserDashboard';

import StaffDashboard from './pages/staff-page/StaffDashboard';



const ProtectedRoute = ({ role, children }) => {
  const [authState, setAuthState] = useState({ loading: true, user: null, role: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthState({ loading: false, user: null, role: null });
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const userRole = docSnap.exists() ? docSnap.data().role : null;

      setAuthState({ loading: false, user, role: userRole });
    });

    return () => unsubscribe();
  }, []);

  if (authState.loading) return <p>Loading...</p>;

  if (!authState.user) return <Navigate to="/" />;

  if (authState.role !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LandingPage />} />

        {/* Admin Protected Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute role="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<AdminSales />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="staffs" element={<AdminStaffs />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* User Protected Route */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute role="User">
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Staff Protected Route */}
        <Route path="/staff-dashboard" element={
          <ProtectedRoute role="Staff">
            <StaffDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
