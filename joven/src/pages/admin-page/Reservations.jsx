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
  getDocs,
  setDoc,
} from "firebase/firestore";
import "../../styles/admin-styles/Reservations.css";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);

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

        // Check if empty
        const resSnap = await getDocs(collection(db, "reservations"));
        if (resSnap.empty) {
          await resetReservationCounter();
        }
      } catch (error) {
        console.error("Error deleting reservation:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return alert("No reservations selected.");
    if (!window.confirm(`Delete ${selected.length} selected reservation(s)?`)) return;

    try {
      for (let id of selected) {
        await deleteDoc(doc(db, "reservations", id));
      }

      const resSnap = await getDocs(collection(db, "reservations"));
      if (resSnap.empty) {
        await resetReservationCounter();
      }

      setSelected([]);
      alert("Selected reservations deleted.");
    } catch (error) {
      console.error("Bulk delete failed:", error);
      alert("Failed to delete some reservations.");
    }
  };

  const resetReservationCounter = async () => {
    try {
      await setDoc(doc(db, "counters", "reservations"), { lastId: 0 });
      console.log("Counter reset to 0");
      alert("Reservation counter reset to 0.");
    } catch (error) {
      console.error("Error resetting counter:", error);
      alert("Failed to reset counter.");
    }
  };

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((r) => r.id));
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
        {filtered.length > 0 && (
          <button className="bulk-delete-btn" onClick={handleBulkDelete}>
            🗑 Delete Selected ({selected.length})
          </button>
        )}
        {reservations.length === 0 && (
          <button className="reset-btn" onClick={resetReservationCounter}>
            🔄 Reset Reservation Counter
          </button>
        )}
      </div>

      <div className="reservation-table-wrapper">
        <table className="reservation-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selected.length === filtered.length}
                  onChange={toggleSelectAll}
                />
              </th>
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
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(res.id)}
                    onChange={() => toggleSelection(res.id)}
                  />
                </td>
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
                <td colSpan="11" className="text-center">
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
