// src/pages/user-page/InvoicePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../styles/InvoicePage.css";


const InvoicePage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const docRef = doc(db, "reservations", reservationId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReservation(docSnap.data());
        } else {
          setReservation(null);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };
    fetchInvoice();
  }, [reservationId]);

  if (!reservation) return <div className="invoice-page">Loading invoice...</div>;

  return (
    <div className="invoice-page">
      <div className="invoice-box">
        <h2>Reservation Invoice</h2>
        <p><strong>Invoice ID:</strong> {reservationId}</p>
        <p><strong>Date:</strong> {reservation.preferredDateTime}</p>

        <hr />

        <h3>Customer Vehicle</h3>
        <p><strong>Brand:</strong> {reservation.vehicleBrand}</p>
        <p><strong>Model:</strong> {reservation.vehicleModel}</p>
        <p><strong>Year:</strong> {reservation.vehicleYear}</p>
        <p><strong>Plate Number:</strong> {reservation.plateNumber}</p>

        <hr />

        <h3>Service & Product</h3>
        <p><strong>Service Type:</strong> {reservation.serviceType}</p>
        <p><strong>Product:</strong> {reservation.productName}</p>
        <p><strong>Size:</strong> {reservation.size}</p>
        <p><strong>Brand:</strong> {reservation.brand}</p>
        <p><strong>Type:</strong> {reservation.type}</p>

        <hr />

        <h3>Payment Details</h3>
        <p><strong>Total Price:</strong> ₱{reservation.price}</p>
        <p><strong>Downpayment (30%):</strong> ₱{reservation.downpayment}</p>
        <p><strong>Payment Method:</strong> {reservation.paymentMethod}</p>

        <hr />

        <p><strong>Status:</strong> {reservation.status}</p>
        <p><strong>Note:</strong> {reservation.note || "None"}</p>

        <button className="back-button" onClick={() => navigate("/my-selections")}>
          Back to My Selections
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
