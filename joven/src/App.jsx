import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';

import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Verify from './pages/Verify';

import AdminDashboard from './pages/admin-page/AdminDashboard';
import AdminSales from './pages/admin-page/Sales';
import AdminInventory from './pages/admin-page/Inventory';
import AdminProducts from './pages/admin-page/Products';
import AdminStaffs from './pages/admin-page/Staffs';
import AdminReservations from './pages/admin-page/Reservations';
import AdminCustomers from './pages/admin-page/Customers';
import AdminSettings from './pages/admin-page/Settings';

import UserDashboard from './pages/user-page/UserDashboard';
import StaffDashboard from './pages/staff-page/StaffDashboard';

import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
  </div>
);

const ProtectedRoute = ({ role, children }) => {
  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAccessGranted(false);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setAccessGranted(false);
          setLoading(false);
          return;
        }

        const userData = userSnap.data();
        const isOTPVerified = localStorage.getItem('isOTPVerified') === 'true';
        const userRole = userData.role;

        if (!isOTPVerified) {
          if (window.location.pathname !== '/verify-2fa') {
            navigate('/verify-2fa');
          }
          setAccessGranted(false);
        } else {
          if (userRole === role) {
            setAccessGranted(true);
          } else {
            navigate('/');
            setAccessGranted(false);
          }
        }
      } catch (err) {
        console.error('ProtectedRoute error:', err);
        setAccessGranted(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, role]);

  if (loading) return <Spinner />;
  return accessGranted ? children : null;
};

const AdminLayout = () => (
  <>
    <AdminDashboard />
    <Outlet />
  </>
);

function App() {
useEffect(() => {
  signOut(auth);
  localStorage.clear(); // Clear any stored OTP/session data
}, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <LandingPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <LandingPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="/verify-2fa" element={<Verify />} />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSales />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="staffs" element={<AdminStaffs />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* User Route */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="User">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Staff Route */}
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute role="Staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
