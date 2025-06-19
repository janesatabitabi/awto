import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginSection = ({ onClose, origin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isAllowedEmail = () => {
    const trimmedEmail = email.trim().toLowerCase();
    return trimmedEmail.endsWith('@gmail.com');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAllowedEmail()) {
      setError('Enter a valid email.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Try both users and staff collections
      const userRef = doc(db, 'users', user.uid);
      const staffRef = doc(db, 'staff', user.uid);

      const [userSnap, staffSnap] = await Promise.all([
        getDoc(userRef),
        getDoc(staffRef),
      ]);

      let userData = null;
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else if (staffSnap.exists()) {
        userData = staffSnap.data();
      } else {
        setError('User record not found in Firestore.');
        return;
      }

      // Store locally for possible future use
      localStorage.setItem('isOTPVerified', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));

      // Redirect based on role
      if (!user.emailVerified) {
        navigate('/verify');
      } else if (userData.role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (userData.role === 'User') {
        navigate('/user-dashboard');
      } else if (userData.role === 'Staff') {
        navigate('/staff-dashboard');
      } else {
        setError('Unknown user role.');
      }

      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-form">
        <button className="close-popup" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Sign in to your account</h2>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <form onSubmit={handleLogin}>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          {!isAllowedEmail() && email && (
            <p style={{ color: 'red', fontSize: '0.875rem' }}>
              Please enter a valid email.
            </p>
          )}

          <label className="form-label mt-3">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button type="submit" className="explore-button mt-5">
            Login
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-center mb-2">Don’t have an account?</p>
          <Link
            to="/register"
            onClick={onClose}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 text-center rounded transition-all duration-200"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
