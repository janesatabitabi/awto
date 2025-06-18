import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const [staffData, setStaffData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const docRef = doc(db, 'staff', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStaffData(docSnap.data());
      } else {
        navigate('/login');
      }
    };

    fetchStaffData();
  }, []);

  return (
    <StaffLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome, {staffData?.fullName || 'Staff'}!</h1>
        <p className="text-gray-700">This is your dashboard. Use the sidebar to navigate.</p>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;
