import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = location.state?.reservation;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!reservation) {
      alert("No reservation found. Redirecting...");
      navigate("/my-selections");
    }
  }, [reservation, navigate]);

  const handlePayNow = () => {
    setLoading(true);
    setTimeout(() => {
      alert("Payment successful via PayMongo mock!");
      navigate("/invoice", { state: { reservation } });
    }, 2000); // Simulate payment delay
  };

  if (!reservation) return null;

  return (
    <div className="payment-page">
      <h2>Payment Summary</h2>
      <div className="payment-card">
        <p><strong>Product:</strong> {reservation.productName}</p>
        <p><strong>Brand:</strong> {reservation.brand}</p>
        <p><strong>Vehicle:</strong> {`${reservation.vehicleBrand} ${reservation.vehicleModel} ${reservation.vehicleYear}`}</p>
        <p><strong>Plate:</strong> {reservation.plateNumber}</p>
        <p><strong>Date & Time:</strong> {reservation.preferredDateTime}</p>
        <p><strong>Service:</strong> {reservation.serviceType}</p>
        <p><strong>Total Price:</strong> ₱{reservation.price}</p>
        <p><strong>Downpayment (30%):</strong> ₱{reservation.downpayment}</p>
      </div>

      <button
        className="pay-button"
        onClick={handlePayNow}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now via PayMongo"}
      </button>

      <button className="cancel-btn" onClick={() => navigate(-1)}>
        ← Go Back
      </button>
    </div>
  );
};

export default PaymentPage;
