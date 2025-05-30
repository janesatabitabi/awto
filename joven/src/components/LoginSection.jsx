import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const LoginSection = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === 'Admin') {
          navigate('/admin-dashboard');
        } else if (role === 'User') {
          navigate('/user-dashboard');
        } else if (role === 'Staff') {
          navigate('/staff-dashboard');
        } else {
          alert('Unauthorized role.');
        }
      } else {
        alert('No user data found in Firestore.');
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
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input"
        placeholder="Enter password"
        required
      />
      <button type="submit" className="login-button">Login</button>

      <p className="create-account-text" onClick={() => navigate('/register')}>
        Don’t have an account? <span className="link">Create an account</span>
      </p>
    </form>
  );
};

export default LoginSection;
