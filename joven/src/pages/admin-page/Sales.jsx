// Sales.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import '../../styles/admin-styles/Sales.css';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [salesLog, setSalesLog] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), snapshot => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
      setFilteredProducts(items);
    });

    const unsubSales = onSnapshot(collection(db, 'sales'), snapshot => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sorted = logs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setSalesLog(sorted);
    });

    return () => {
      unsubProducts();
      unsubSales();
    };
  }, []);

  const handleSearch = () => {
    const filtered = products.filter(p =>
      `${p.brand} ${p.model} ${p.size}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSubmit = async () => {
    if (!customerName || !selectedProduct || quantity <= 0 || quantity > selectedProduct.stock) {
      alert('Please complete the form properly.');
      return;
    }

    const total = selectedProduct.price * quantity;

    const saleData = {
      customerName,
      productId: selectedProduct.id,
      productName: `${selectedProduct.brand} ${selectedProduct.model}`,
      quantity,
      unitPrice: selectedProduct.price,
      totalAmount: total,
      createdAt: Timestamp.now(),
      type: 'in-store',
      status: 'completed',
    };

    try {
      await addDoc(collection(db, 'sales'), saleData);
      await updateDoc(doc(db, 'products', selectedProduct.id), {
        stock: selectedProduct.stock - quantity,
      });

      // reset form
      setCustomerName('');
      setSelectedProduct(null);
      setSearchTerm('');
      setQuantity(1);
      setShowForm(false);
      alert('Sale recorded!');
    } catch (err) {
      console.error('Sale error:', err);
    }
  };

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h1>Sales Transactions</h1>
        <button onClick={() => setShowForm(true)}>+ Add Transaction</button>
      </div>

      {showForm && (
        <div className="sales-modal">
          <div className="sales-form large">
            <h2>New Sale</h2>

            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <div className="search-section">
              <input
                type="text"
                placeholder="Search product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            <div className="search-results-grid">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  className={`product-result-card ${selectedProduct?.id === p.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProduct(p)}
                >
                  <strong>{p.brand} {p.model} {p.size}</strong>
                  <p>₱{p.price} — {p.stock} in stock</p>
                </div>
              ))}
            </div>

            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <div className="form-buttons">
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <table className="sales-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {salesLog.map(log => (
            <tr key={log.id}>
              <td>{log.createdAt?.toDate().toLocaleDateString()}</td>
              <td>{log.customerName}</td>
              <td>{log.productName}</td>
              <td>{log.quantity}</td>
              <td>₱{log.unitPrice.toFixed(2)}</td>
              <td>₱{log.totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
