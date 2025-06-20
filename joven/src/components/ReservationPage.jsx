import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/ReservationPage.css";

const ReservationPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [serviceType, setServiceType] = useState("Installation");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

  const [preferredDate, setPreferredDate] = useState(new Date());
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");
  const [reservedTimes, setReservedTimes] = useState([]);

  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
  const downpayment = 500; // constant for display and submission

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
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchReservedSlots = async () => {
      if (!productId || !preferredDate) return;
      const selectedDate = preferredDate.toISOString().split("T")[0];
      try {
        const q = query(
          collection(db, "reservations"),
          where("productId", "==", productId),
          where("preferredDateTime", ">=", `${selectedDate} 00:00`),
          where("preferredDateTime", "<=", `${selectedDate} 23:59`),
          where("isCancelled", "==", false)
        );
        const snapshot = await getDocs(q);
        const takenTimes = snapshot.docs.map((doc) =>
          doc.data().preferredDateTime.split(" ")[1]
        );
        setReservedTimes(takenTimes);
      } catch (error) {
        console.error("Error fetching time slots:", error);
      }
    };
    fetchReservedSlots();
  }, [preferredDate, productId]);

  const handleSubmit = async () => {
    if (!user) return alert("You must be logged in.");
    if (
      !vehicleBrand ||
      !vehicleModel ||
      !vehicleYear ||
      !plateNumber ||
      !preferredDate ||
      !preferredTime
    ) {
      return alert("Please complete all required fields.");
    }

    // Validate required product fields
    if (!product || !product.brand || !product.size) {
      console.error("❌ Incomplete product data:", product);
      return alert("Product information is incomplete.");
    }

    // Safely compose productName with fallback
    const productName = `${product.brand || ""} ${product.model || ""} ${product.size || ""}`.trim();

    const formattedDate = preferredDate.toLocaleDateString("en-CA");
    const fullDateTime = `${formattedDate} ${preferredTime}`;
    const price = Number(product.price || 0);

    const reservationData = {
      userId: user.uid,
      productId: product.id,
      productName,
      brand: product.brand,
      model: product.model || "",
      size: product.size,
      type: product.type || "",
      price,
      downpayment,
      serviceType,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      plateNumber,
      preferredDateTime: fullDateTime,
      note,
      paymentMethod: "PayMongo",
      status: "Pending Payment",
      isCancelled: false,
      createdAt: serverTimestamp(),
    };

    try {
      console.log("🚀 Submitting reservation:", reservationData);
      const resRef = await addDoc(collection(db, "reservations"), reservationData);
      alert("Reservation submitted! Redirecting to invoice...");
      navigate(`/invoice/${resRef.id}`);
    } catch (err) {
      console.error("❌ Reservation error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) return <div className="reservation-page">Loading...</div>;
  if (!product) return <div className="reservation-page">Product not found.</div>;

  return (
    <div className="reservation-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h2>Reserve: {product.brand} {product.model} {product.size}</h2>

      <div className="reservation-form">
        <h3 style={{ marginBottom: "0.5rem", color: "#1f2937" }}>
          Product: {product.brand} {product.model} {product.size}
        </h3>

        <label>Service Type</label>
        <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
          <option>Installation</option>
          <option>Wheel Alignment</option>
          <option>Balancing</option>
        </select>

        <label>Vehicle Info</label>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            value={vehicleBrand}
            onChange={(e) => setVehicleBrand(e.target.value)}
            placeholder="Brand (e.g. Toyota)"
            style={{ flex: 1 }}
          />
          <input
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            placeholder="Model (e.g. Vios)"
            style={{ flex: 1 }}
          />
          <input
            value={vehicleYear}
            onChange={(e) => setVehicleYear(e.target.value)}
            placeholder="Year (e.g. 2020)"
            style={{ flex: 1 }}
          />
        </div>

        <label>Plate Number</label>
        <input
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          placeholder="e.g. ABC 1234"
        />

        <label>Preferred Date</label>
        <Calendar
          onChange={setPreferredDate}
          value={preferredDate}
          minDate={new Date()}
        />

        <label>Preferred Time</label>
        <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}>
          <option value="">Select a time</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot} disabled={reservedTimes.includes(slot)}>
              {slot} {reservedTimes.includes(slot) ? "(Reserved)" : ""}
            </option>
          ))}
        </select>

        <label>Additional Notes</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Request or instruction..."
        />

        <div className="price-summary">
          <p><strong>Price:</strong> ₱{product.price}</p>
          <p><strong>Downpayment:</strong> ₱{downpayment}</p>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Reservation
        </button>
      </div>
    </div>
    
  );
};

export default ReservationPage;
