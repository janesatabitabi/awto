import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        gender: formData.gender,
        birthday: formData.birthday,
        role: 'User',
      });

      alert('Account created successfully!');
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="login-form" style={{ maxWidth: '500px', margin: '4rem auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Create an Account</h2>
      <form onSubmit={handleRegister}>
        <label className="form-label" htmlFor="name">Name:</label>
        <input
          id="name"
          className="form-input"
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />

        <label className="form-label" htmlFor="email">Email:</label>
        <input
          id="email"
          className="form-input"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <label className="form-label" htmlFor="password">Password:</label>
        <input
          id="password"
          className="form-input"
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
        />

        <label className="form-label" htmlFor="address">Address:</label>
        <input
          id="address"
          className="form-input"
          type="text"
          name="address"
          required
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
        />

        <label className="form-label" htmlFor="gender">Gender:</label>
        <select
          id="gender"
          className="form-input"
          name="gender"
          required
          value={formData.gender}
          onChange={handleChange}
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
          required
          value={formData.birthday}
          onChange={handleChange}
        />

        <button className="login-button" type="submit" style={{ marginTop: '1.5rem', width: '100%' }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
