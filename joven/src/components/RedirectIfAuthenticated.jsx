// src/components/RedirectIfAuthenticated.jsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const RedirectIfAuthenticated = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const { role } = data;

          if (role === 'Admin') setRedirectPath('/admin-dashboard');
          else if (role === 'User') setRedirectPath('/user-dashboard');
          else if (role === 'Staff') setRedirectPath('/staff-dashboard');
        }
      } catch (err) {
        console.error('Failed to fetch role during redirect:', err);
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) return <div>Checking authentication...</div>;
  if (redirectPath) return <Navigate to={redirectPath} replace />;
  return children;
};

export default RedirectIfAuthenticated;
