import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Public Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import ViewProduct from './components/ViewProduct';
import Verify from './pages/Verify';

// Admin Pages
import AdminDashboard from './pages/admin-page/AdminDashboard';
import AdminSales from './pages/admin-page/Sales';
import AdminInventory from './pages/admin-page/Inventory';
import AdminProducts from './pages/admin-page/Products';
import AdminStaffs from './pages/admin-page/Staffs';
import AdminReservations from './pages/admin-page/Reservations';
import AdminCustomers from './pages/admin-page/Customers';
import AdminSettings from './pages/admin-page/Settings';

// User Pages
import UserDashboard from './pages/user-page/UserDashboard';
import UserProfile from './pages/user-page/UserProfile';

// Staff Pages
import StaffDashboard from './pages/staff-page/StaffDashboard';
import StaffInventory from './pages/staff-page/StaffInventory';

// Auth Guards
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import RequireVerifiedEmail from './components/RequireVerifiedEmail';

// Spinner UI
const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
  </div>
);

// ProtectedRoute: ensures auth, email verification, and correct role
const ProtectedRoute = ({ role, children }) => {
  const [loading, setLoading] = useState(true);
  const [granted, setGranted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userId = user.uid;

        // Check if the user exists in 'users' or 'staff'
        const userRef = doc(db, 'users', userId);
        const staffRef = doc(db, 'staff', userId);

        const [userSnap, staffSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(staffRef),
        ]);

        const data = userSnap.exists() ? userSnap.data() : staffSnap.exists() ? staffSnap.data() : null;

        if (!data) {
          navigate('/');
          return;
        }

        // Match role
        if (data.role === role) {
          setGranted(true);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Authorization error:', err);
        navigate('/');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [role, navigate]);

  if (loading) return <Spinner />;
  return granted ? children : null;
};

// Wrapper to track origin path
const WithOrigin = ({ children }) => {
  const location = useLocation();
  return React.cloneElement(children, { origin: location.pathname });
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <WithOrigin>
              <RedirectIfAuthenticated>
                <LandingPage />
              </RedirectIfAuthenticated>
            </WithOrigin>
          }
        />
        <Route
          path="/register"
          element={
            <WithOrigin>
              <RedirectIfAuthenticated>
                <Register />
              </RedirectIfAuthenticated>
            </WithOrigin>
          }
        />
        <Route path="/verify" element={<Verify />} />
        <Route path="/view-product/:id" element={<ViewProduct />} />

        {/* User Routes */}
        <Route
          path="/profile"
          element={
            <RequireVerifiedEmail>
              <ProtectedRoute role="User">
                <UserProfile />
              </ProtectedRoute>
            </RequireVerifiedEmail>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <RequireVerifiedEmail>
              <ProtectedRoute role="User">
                <UserDashboard />
              </ProtectedRoute>
            </RequireVerifiedEmail>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <RequireVerifiedEmail>
              <ProtectedRoute role="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            </RequireVerifiedEmail>
          }
        >
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="staffs" element={<AdminStaffs />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Staff Routes */}
        <Route
          path="/staff-dashboard"
          element={
            <RequireVerifiedEmail>
              <ProtectedRoute role="Staff">
                <StaffDashboard />
              </ProtectedRoute>
            </RequireVerifiedEmail>
          }
        />
        <Route
          path="/staff-inventory"
          element={
            <RequireVerifiedEmail>
              <ProtectedRoute role="Staff">
                <StaffInventory />
              </ProtectedRoute>
            </RequireVerifiedEmail>
          }
        />
      </Routes>
    </Router>
  );
}
