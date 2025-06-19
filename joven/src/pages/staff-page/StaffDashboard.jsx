import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import StaffLayout from './StaffLayout';
import '../../styles/staff-styles/StaffDashboard.css';


const StaffDashboard = () => {
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const docRef = doc(db, 'users', user.uid); // Assumes staff data in 'users'
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStaffData(docSnap.data());
      } else {
        navigate('/login');
      }

      setLoading(false);
    };

    fetchStaffData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <StaffLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          Welcome, {staffData?.name || 'Staff'}!
        </h1>
        <p className="text-gray-700">This is your dashboard. Use the sidebar to explore.</p>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;
