// src/components/RedirectIfAuthenticated.jsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const RedirectIfAuthenticated = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const { role } = userSnap.data() || {};

          switch (role) {
            case 'Admin':
              setRedirectTo('/admin-dashboard');
              break;
            case 'User':
              setRedirectTo('/user-dashboard');
              break;
            case 'Staff':
              setRedirectTo('/staff-dashboard');
              break;
            default:
              setRedirectTo('/');
          }
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) return <div>Checking authentication...</div>;
  if (redirectTo) return <Navigate to={redirectTo} replace />;
  return children;
};

export default RedirectIfAuthenticated;
