import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { db, secondaryAuth } from '../../firebase';
import '../../styles/admin-styles/Staffs.css';

const Staffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch staff users from Firestore
  const fetchStaffs = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'Staff'));
      const querySnapshot = await getDocs(q);
      const staffList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStaffs(staffList);
    } catch (error) {
      console.error('Error fetching staff:', error);
      alert('Failed to load staff data.');
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  // ✅ Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Add staff handler
  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        newStaff.email,
        newStaff.password
      );
      const newUser = userCredential.user;

      await sendEmailVerification(newUser);

      await setDoc(doc(db, 'users', newUser.uid), {
        name: newStaff.name,
        email: newStaff.email,
        role: 'Staff',
        createdAt: new Date().toISOString(),
      });

      await fetchStaffs();
      setNewStaff({ name: '', email: '', password: '' });
      alert('✅ Staff account created and email verification sent.');
    } catch (error) {
      console.error('Error creating staff:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete staff handler
  const handleDeleteStaff = async (uid) => {
    const confirm = window.confirm('Are you sure you want to delete this staff?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'users', uid));
      await fetchStaffs();
      alert('✅ Staff deleted successfully.');
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('❌ Failed to delete staff.');
    }
  };

  return (
    <div className="staff-container">
      <div className="staff-header">
        <h2>👥 Staff Management</h2>
      </div>

      <div className="staff-content">
        {/* Form Section */}
        <div className="staff-form-section">
          <h3>Add New Staff</h3>
          <form className="staff-form" onSubmit={handleAddStaff}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={newStaff.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={newStaff.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Temporary Password"
              value={newStaff.password}
              onChange={handleInputChange}
              required
              minLength={6}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : '➕ Add Staff'}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="staff-list-section">
          <h3>Current Staff</h3>
          {staffs.length === 0 ? (
            <p className="no-staff">No staff registered yet.</p>
          ) : (
            <ul className="staff-list">
              {staffs.map((staff) => (
                <li key={staff.id} className="staff-item">
                  <div className="staff-avatar">
                    <span>{staff.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="staff-info">
                    <strong>{staff.name}</strong>
                    <small>{staff.email}</small>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteStaff(staff.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staffs;
