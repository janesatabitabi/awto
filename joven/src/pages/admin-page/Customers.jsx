import React, { useState } from 'react';
import '../../styles/admin-styles/Customers.css';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample static data (for UI purposes)
  const customers = [
    { id: 1, name: 'Juan Dela Cruz', email: 'juan@email.com', status: 'Active' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', status: 'Inactive' },
    { id: 3, name: 'Pedro Ramirez', email: 'pedro@email.com', status: 'Active' },
  ];

  const filtered = customers.filter(c =>
    `${c.name} ${c.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h1>👥 Customers</h1>
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="customers-search"
        />
      </div>

      <div className="customers-table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No customers found.</td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="avatar">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>
                    <span className={`status-badge ${customer.status.toLowerCase()}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <button className="delete-btn">🗑 Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
