import React from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const ResetCounterModal = ({ isOpen, onClose }) => {
  const handleReset = async () => {
    const input = prompt('To confirm reset, enter the admin password:');
    if (!input) return;

    const adminRef = doc(db, 'settings', 'admin');
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
      const storedPassword = adminSnap.data().password;
      if (input === storedPassword) {
        await setDoc(doc(db, 'metadata', 'productCounter'), { current: 0 });
        alert('Product ID counter reset successfully.');
        onClose();
      } else {
        alert('Incorrect password. Reset cancelled.');
      }
    } else {
      alert('Admin password not found in Firestore.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Reset Product ID Counter</h2>
        <p>This will reset the Product ID counter back to 0.</p>
        <div className="form-actions">
          <button onClick={handleReset}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ResetCounterModal;
