import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import emailjs from 'emailjs-com';

const LoginSection = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const sendOTP = async (email, otp) => {
    try {
      await emailjs.send(
        'service_b2k1tzs',
        'template_0stzxse',
        {
          to_email: email,
          otp: otp
        },
        'fxJ47rab2fQziSaDE'
      );
    } catch (err) {
      console.error('Failed to send OTP:', err);
      alert('Failed to send OTP email.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        alert('No user data found in Firestore.');
        return;
      }

      const role = userDoc.data().role;
      const twoFADoc = await getDoc(doc(db, '2fa', user.uid));
      const is2FAEnabled = twoFADoc.exists() && twoFADoc.data().enabled;

      localStorage.setItem('userUID', user.uid);
      localStorage.setItem('userRole', role);
      localStorage.setItem('isOTPVerified', 'false');

      if (is2FAEnabled) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000;

        await setDoc(doc(db, '2fa', user.uid), {
          enabled: true,
          lastOTP: otp,
          expiresAt: expiresAt,
        });

        await sendOTP(email, otp);

        navigate('/verify-2fa');
      } else {
        localStorage.setItem('isOTPVerified', 'true');
        if (role === 'Admin') {
          navigate('/admin-dashboard');
        } else if (role === 'User') {
          navigate('/user-dashboard');
        } else if (role === 'Staff') {
          navigate('/staff-dashboard');
        } else {
          alert('Unauthorized role.');
        }
      }
    } catch (error) {
      console.error('Login error:', error.message);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Login</h2>

      <label htmlFor="email" className="form-label">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
        placeholder="Enter email"
        required
      />

      <label htmlFor="password" className="form-label">Password</label>
      <div className="password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          placeholder="Enter password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-password"
          aria-label="Toggle password visibility"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      <button type="submit" className="login-button">Login</button>

      <p className="create-account-text" onClick={() => navigate('/register')}>
        Don’t have an account? <span className="link">Create an account</span>
      </p>
    </form>
  );
};

export default LoginSection;
