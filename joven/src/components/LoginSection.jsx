import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginSection = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError('User data not found.');
        return;
      }

      const userData = userSnap.data();
      const role = userData.role;

      // Optional: clear any OTP verification flags
      localStorage.setItem('isOTPVerified', 'true');

      // Redirect based on role
      if (role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (role === 'User') {
        navigate('/user-dashboard');
      } else if (role === 'Staff') {
        navigate('/staff-dashboard');
      } else {
        setError('Unknown user role.');
      }

      if (onClose) onClose(); // Close popup if provided

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

          <label className="form-label">Password</label>
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

          <button type="submit" className="explore-button" style={{ marginTop: '1.5rem' }}>
            Login
          </button>
        </form>

        <p className="create-account-text">
          Don’t have an account?{' '}
          <Link className="link" to="/register" onClick={onClose}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginSection;
