// src/pages/admin-page/AdminDashboardContent.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import '../../styles/admin-styles/AdminDashboardContent.css';

const AdminDashboardContent = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sales'), (snapshot) => {
      let orders = 0;
      let earnings = 0;
      const customers = new Set();

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        orders++;
        earnings += Number(data.totalAmount || 0);
        customers.add(data.customerName); // or customerId
      });

      setTotalOrders(orders);
      setTotalEarnings(earnings);
      setTotalCustomers(customers.size);
    });

    return () => unsubscribe();
  }, []);

  const formatCurrency = (amount) => `₱${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Admin Dashboard</h1>
      </div>

      <div className="summary-cards-grid">
        <SummaryCard title="Total Orders" value={totalOrders} icon="🧾" bg="purple" />
        <SummaryCard title="Total Earnings" value={formatCurrency(totalEarnings)} icon="💰" bg="green" />
        <SummaryCard title="Total Revenue" value={formatCurrency(totalEarnings * 0.9)} icon="📈" bg="yellow" />
        <SummaryCard title="Total Expenses" value={formatCurrency(totalEarnings * 0.2)} icon="📉" bg="blue" />
        <SummaryCard title="Total Customers" value={totalCustomers} icon="👥" bg="pink" />
        <SummaryCard title="Growth" value="34,678" icon="📊" bg="red" />
      </div>
    </div>
  );
};

// Card component
const SummaryCard = ({ title, value, icon, bg }) => {
  return (
    <div className={`card ${bg}-bg`}>
      <div className="card-content">
        <p className="card-label">{title}</p>
        <h2 className="card-value">{value}</h2>
        <p className="card-subtext">Since Last Month <span className="positive-change">1.5%↑</span></p>
      </div>
      <div className="card-icon-wrapper">
        <span className="card-icon-text">{icon}</span>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
