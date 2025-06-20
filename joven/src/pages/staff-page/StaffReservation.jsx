// src/pages/staff-page/StaffReservations.jsx
import React, { useEffect, useState } from 'react';
// Path for firebase.js: from 'src/pages/staff-page/' up to 'src/', then to 'firebase.js'
import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp, // Added for 'Approved' status timestamp
} from 'firebase/firestore';
// Path for StaffLayout.jsx: it's in the SAME directory as StaffReservations.jsx
import StaffLayout from './StaffLayout';
// Path for StaffReservations.css: from 'src/pages/staff-page/' up to 'src/', then down into 'styles/staff-styles/'
import '../../styles/staff-styles/StaffReservation.css'; // This will now contain admin's reservation styles

const StaffReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(''); // For custom messages (success, error, confirmation)
  const [showConfirm, setShowConfirm] = useState(false); // To show/hide custom confirmation
  const [reservationToDelete, setReservationToDelete] = useState(null); // Stores ID of reservation to delete

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'reservations'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(list);
    }, (error) => {
      console.error("Error fetching reservations:", error);
      setMessage(`Error loading reservations: ${error.message}`);
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const reservationRef = doc(db, 'reservations', id);
      const updateData = { status: newStatus };

      // If status is 'Approved', add or update the approvedAt timestamp
      if (newStatus === "Approved") {
        updateData.approvedAt = serverTimestamp();
      } else {
        // Optionally, remove approvedAt if status changes from Approved
        // This depends on your business logic if you want to clear it
        // updateData.approvedAt = deleteField(); // Requires `deleteField` from firebase/firestore
      }

      await updateDoc(reservationRef, updateData);
      setMessage('Reservation status updated successfully!');
    } catch (error) {
      console.error('Error updating reservation status:', error);
      setMessage(`Failed to update status: ${error.message}`);
    }
  };

  const handleDeleteClick = (id) => {
    setReservationToDelete(id);
    setShowConfirm(true);
    setMessage('Are you sure you want to delete this reservation?');
  };

  const confirmDelete = async () => {
    if (reservationToDelete) {
      try {
        await deleteDoc(doc(db, 'reservations', reservationToDelete));
        setMessage('Reservation deleted successfully!');
      } catch (error) {
        console.error('Error deleting reservation:', error);
        setMessage(`Failed to delete reservation: ${error.message}`);
      } finally {
        // Always reset confirmation state and ID after attempt
        setShowConfirm(false);
        setReservationToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setReservationToDelete(null);
    setMessage(''); // Clear message when cancelled
  };

  // Filtering logic matches the Admin's version more closely for search term
  const filtered = reservations.filter(r =>
    `${r.customerName || ''} ${r.plateNumber || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StaffLayout>
      <div className="reservations-container">
        <div className="reservations-header">
          <h1>📅 Reservations</h1>
          <input
            type="text"
            placeholder="Search by name or plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="reservation-search"
          />
        </div>

        {/* Custom Message Display */}
        {message && (
          <div className={`message-box ${message.includes('Error') || message.includes('Failed') || message.includes('sure you want to delete') ? 'error' : 'success'}`}>
            {message}
            {showConfirm && (
              <div className="confirm-actions">
                <button onClick={confirmDelete} className="confirm-btn">Yes, Delete</button>
                <button onClick={cancelDelete} className="cancel-btn">No, Cancel</button>
              </div>
            )}
          </div>
        )}

        <div className="reservation-table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Posted</th>
                <th>Approved</th>
                <th>Scheduled</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Vehicle Info</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((res) => (
                  <tr key={res.id} className="reservation-row">
                    <td>{res.id || 'N/A'}</td>
                    <td>{res.createdAt?.toDate().toLocaleString() || "—"}</td>
                    <td>{res.approvedAt?.toDate().toLocaleString() || "—"}</td>
                    <td>{res.preferredDateTime || "—"}</td> {/* Assuming this is how scheduled date/time is stored */}
                    <td>{res.customerName || "—"}</td>
                    <td>{res.serviceType || res.service || "—"}</td> {/* Use serviceType or fallback to service */}
                    <td>
                      {res.vehicleBrand || ''} {res.vehicleModel || ''} {res.vehicleYear || ''}
                      <br />
                      <small>{res.plateNumber || 'N/A'}</small>
                    </td>
                    <td>{res.note || "—"}</td>
                    <td>
                      <select
                        className="status-dropdown"
                        value={res.status || "Pending"}
                        onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Declined">Declined</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(res.id)} // Use custom delete handler
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center no-reservations-found"> {/* colSpan updated to 10 */}
                    No reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffReservations;
