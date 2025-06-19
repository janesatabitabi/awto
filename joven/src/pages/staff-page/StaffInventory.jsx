import React from 'react';
import StaffLayout from './StaffLayout';
import '../../styles/staff-styles/StaffInventory.css';


const StaffInventory = () => {
  return (
    <StaffLayout>
      <h1 className="text-xl font-bold text-blue-600 mb-4">📦 Inventory (View Only)</h1>
      <p className="text-gray-600">This page will show inventory data for staff (read-only).</p>
    </StaffLayout>
  );
};

export default StaffInventory;
