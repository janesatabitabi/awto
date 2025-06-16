import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const ProtectedRoute = ({ allowedRole, children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.emailVerified) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAuthorized(userData.role === allowedRole);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowedRole]);

  if (loading) return <div className="text-center py-20 text-lg">Loading...</div>;
  if (!isAuthorized) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
