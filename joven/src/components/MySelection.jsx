import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase";
import "../../styles/MySelection.css";

const MySelection = () => {
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const q = query(
          collection(db, "reservations"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservations(results);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="my-selections-page">Loading...</div>;

  return (
    <div className="my-selections-page">
      <h2>My Reservations</h2>
      {reservations.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        <div className="reservation-list">
          {reservations.map((res) => (
            <div key={res.id} className="reservation-card">
              <h3>{res.productName}</h3>
              <p><strong>Service:</strong> {res.serviceType}</p>
              <p><strong>Date & Time:</strong> {res.preferredDateTime}</p>
              <p><strong>Price:</strong> ₱{res.price.toLocaleString()}</p>
              <p><strong>Status:</strong> {res.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySelection;
