import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Verify = () => {
  const navigate = useNavigate();
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    const uid = localStorage.getItem('userUID');
    const role = localStorage.getItem('userRole');

    if (!uid) {
      setError('User not logged in.');
      return;
    }

    try {
      const docRef = doc(db, '2fa', uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError('No OTP found for user.');
        return;
      }

      const { lastOTP, expiresAt } = docSnap.data();
      const now = Date.now();

      if (now > expiresAt) {
        setError('OTP expired. Please login again.');
        return;
      }

      if (otpInput === lastOTP) {
        // ✅ Mark OTP as verified in localStorage
        localStorage.setItem('isOTPVerified', 'true');

        // ✅ Redirect based on role
        if (role === 'Admin') {
          navigate('/admin-dashboard');
        } else if (role === 'User') {
          navigate('/user-dashboard');
        } else if (role === 'Staff') {
          navigate('/staff-dashboard');
        } else {
          setError('Unauthorized role.');
        }
      } else {
        setError('Invalid OTP.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Error verifying OTP.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">Enter OTP</h2>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            placeholder="Enter the 6-digit OTP"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            maxLength={6}
            required
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
