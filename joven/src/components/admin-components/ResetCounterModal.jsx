import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const PRODUCT_TYPE_PREFIXES = {
  Tire: 'TI',
  Mags: 'MA',
  Accessories: 'AC',
};

const ResetCounterModal = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState('Tire');
  const [nextIdPreview, setNextIdPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNextId = async (type) => {
    try {
      setLoading(true);
      const prefix = PRODUCT_TYPE_PREFIXES[type];
      const counterRef = doc(db, 'counters', `productCounter_${prefix}`);
      const snap = await getDoc(counterRef);
      const current = snap.exists() ? snap.data().lastId : 0;
      const nextId = `${prefix}-${String(current + 1).padStart(5, '0')}`;
      setNextIdPreview(nextId);
    } catch (err) {
      console.error('Failed to fetch next ID preview:', err);
      setNextIdPreview('Error');
      setError('Failed to load next ID.');
    } finally {
      setLoading(false);
    }
  };

  const verifyAdmin = async () => {
    const user = auth.currentUser;
    if (!user) return false;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return userDoc.exists() && userDoc.data().role === 'Admin';
  };

  const handleReset = async () => {
    setError('');
    setLoading(true);

    try {
      const isAdmin = await verifyAdmin();
      if (!isAdmin) {
        setError('❌ You are not authorized to reset the counter.');
        return;
      }

      const prefix = PRODUCT_TYPE_PREFIXES[selectedType];
      const counterRef = doc(db, 'counters', `productCounter_${prefix}`);
      await setDoc(counterRef, { lastId: 0 }, { merge: true });

      alert(`✅ ${selectedType} counter has been reset to 0.`);
      onClose(); // Close the modal
    } catch (err) {
      console.error('Reset failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNextId(selectedType);
      setError('');
    }
  }, [isOpen, selectedType]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Reset Product ID Counter</h2>

        <div className="form-group">
          <label htmlFor="type">Select Product Type</label>
          <select
            id="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="Tire">Tire</option>
            <option value="Mags">Mags</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <p>
          <strong>Next Product ID:</strong>{' '}
          {loading ? 'Loading...' : nextIdPreview}
        </p>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button onClick={handleReset} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Counter'}
          </button>
          <button onClick={onClose} disabled={loading}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ResetCounterModal;
