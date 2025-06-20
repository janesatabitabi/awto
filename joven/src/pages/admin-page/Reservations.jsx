// src/pages/admin-page/Reservations.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import "../../styles/admin-styles/Reservations.css";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reservations"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(list);
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const reservationRef = doc(db, "reservations", id);
      const updateData = { status: newStatus };

      if (newStatus === "Approved") {
        updateData.approvedAt = serverTimestamp();
      }

      await updateDoc(reservationRef, updateData);
      console.log("Status updated");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await deleteDoc(doc(db, "reservations", id));
        console.log("Reservation deleted");
      } catch (error) {
        console.error("Error deleting reservation:", error);
      }
    }
  };

  const filtered = reservations.filter((r) =>
    `${r.customerName} ${r.plateNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            {filtered.map((res) => (
              <tr key={res.id} className="reservation-row">
                <td>{res.id}</td>
                <td>{res.createdAt?.toDate().toLocaleString() || "—"}</td>
                <td>{res.approvedAt?.toDate().toLocaleString() || "—"}</td>
                <td>{res.preferredDateTime || "—"}</td>
                <td>{res.customerName || "—"}</td>
                <td>{res.serviceType || res.service || "—"}</td>
                <td>
                  {res.vehicleBrand} {res.vehicleModel} {res.vehicleYear}
                  <br />
                  <small>{res.plateNumber}</small>
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
                    onClick={() => handleDelete(res.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reservations;
