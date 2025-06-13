import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/LandingPage.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    gender: '',
    birthday: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const { name, email, password, address, gender, birthday } = formData;

    if (!name || !email || !password || !address || !gender || !birthday) {
      alert('All fields are required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Invalid email format.');
      return false;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return false;
    }

    const birthDate = new Date(birthday);
    const today = new Date();
    if (birthDate > today) {
      alert('Birthday cannot be in the future.');
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        gender: formData.gender,
        birthday: formData.birthday,
        role: 'User',
        createdAt: new Date(),
      });

      // Initialize 2FA settings (optional default: disabled)
      await setDoc(doc(db, '2fa', user.uid), {
        enabled: false,
        lastOTP: null,
        expiresAt: null,
      });

      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-form" style={{ maxWidth: '500px', margin: '4rem auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label className="form-label" htmlFor="name">Name:</label>
          <input
            id="name"
            className="form-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label className="form-label" htmlFor="email">Email:</label>
          <input
            id="email"
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label className="form-label" htmlFor="password">Password:</label>
          <input
            id="password"
            className="form-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />

          <label className="form-label" htmlFor="address">Address:</label>
          <input
            id="address"
            className="form-input"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
          />

          <label className="form-label" htmlFor="gender">Gender:</label>
          <select
            id="gender"
            className="form-input"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label className="form-label" htmlFor="birthday">Birthday:</label>
          <input
            id="birthday"
            className="form-input"
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />

          <button
            className="register-button"
            type="submit"
            style={{ marginTop: '1.5rem' }}
          >
            Register
          </button>

        </form>
      </div>
    </>
  );
};

export default Register;
