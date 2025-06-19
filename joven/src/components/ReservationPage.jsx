import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/ReservationPage.css";

const ReservationPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [serviceType, setServiceType] = useState("Installation");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ ...docSnap.data(), id: docSnap.id });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async () => {
    if (!user) return alert("Login required");
    if (!preferredDate || !preferredTime || !vehicleInfo)
      return alert("Please fill in all required fields.");

    const price = Number(product.price);
    const downpayment = Math.floor(price * 0.3);

    const data = {
      userId: user.uid,
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      type: product.type,
      size: product.size,
      price,
      serviceType,
      vehicleInfo,
      preferredDateTime: `${preferredDate} ${preferredTime}`,
      note,
      status: "Pending Payment",
      downpayment,
      paymentMethod: "PayMongo",
      createdAt: serverTimestamp(),
      isCancelled: false,
    };

    try {
      await addDoc(collection(db, "reservations"), data);
      alert("Reservation submitted successfully.");
      navigate("/my-selections");
    } catch (e) {
      console.error("Reservation error:", e);
      alert("Submission failed. Please try again.");
    }
  };

  if (loading) return <div className="reservation-page">Loading...</div>;
  if (!product)
    return <div className="reservation-page">Product not found.</div>;

  return (
    <div className="reservation-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Reserve: {product.name}</h2>
      <div className="reservation-form">
        <label>Service Type</label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        >
          <option>Installation</option>
          <option>Wheel Alignment</option>
          <option>Balancing</option>
        </select>

        <label>Vehicle Info</label>
        <input
          value={vehicleInfo}
          onChange={(e) => setVehicleInfo(e.target.value)}
          placeholder="e.g. Toyota Vios 2020"
        />

        <label>Preferred Date</label>
        <input
          type="date"
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
        />

        <label>Preferred Time</label>
        <input
          type="time"
          value={preferredTime}
          onChange={(e) => setPreferredTime(e.target.value)}
        />

        <label>Additional Notes</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Request or instruction..."
        />

        <div className="price-summary">
          <p>
            <strong>Price:</strong> ₱{product.price}
          </p>
          <p>
            <strong>Downpayment:</strong> ₱{Math.floor(Number(product.price) * 0.3)}
          </p>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Reservation
        </button>
      </div>
    </div>
  );
};

export default ReservationPage;
