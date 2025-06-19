// src/pages/staff-page/StaffSales.jsx
import React, { useState, useEffect } from 'react';
// This path goes up two directories from 'staff-page' to 'pages', then from 'pages' to 'src',
// where 'firebase.js' is expected to be.
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
// This path assumes 'StaffLayout.jsx' is in the SAME directory as 'StaffSales.jsx'.
import StaffLayout from './StaffLayout';
// This path goes up two directories from 'staff-page' to 'pages', then from 'pages' to 'src',
// then down into 'styles/staff-styles'.
import '../../styles/staff-styles/StaffSales.css';

const StaffSales = () => {
  const [products, setProducts] = useState([]);
  const [salesLog, setSalesLog] = useState([]);
  const [showForm, setShowForm] = useState(false); // Controls visibility of the sales form

  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Corrected syntax
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(''); // State for custom messages

  // Effect to fetch products and sales log in real-time
  useEffect(() => {
    // Listener for 'products' collection
    const unsubProducts = onSnapshot(collection(db, 'products'), snapshot => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
      setFilteredProducts(items); // Initialize filtered products with all products
    }, (error) => {
      console.error("Error fetching products:", error);
      setMessage(`Error loading products: ${error.message}`); // More specific error
    });

    // Listener for 'sales' collection
    const unsubSales = onSnapshot(collection(db, 'sales'), snapshot => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort sales logs by creation date in descending order (latest first)
      const sorted = logs.sort((a, b) =>
        (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
      setSalesLog(sorted);
    }, (error) => {
      console.error("Error fetching sales log:", error);
      setMessage(`Error loading sales history: ${error.message}`); // More specific error
    });

    // Cleanup function for listeners
    return () => {
      unsubProducts();
      unsubSales();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Handles searching for products within the sales form
  const handleSearch = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = products.filter(p =>
      // Combine brand, model, and size for comprehensive search
      `${p.productId} ${p.brand} ${p.model} ${p.size}`.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredProducts(filtered);
  };

  // Handles submitting a new sales transaction
  const handleSubmit = async () => {
    // Basic validation
    if (!customerName.trim() || !selectedProduct || quantity <= 0 || quantity > selectedProduct.stock) {
      setMessage('Please ensure all fields are filled, a product is selected, and quantity is valid (within stock limits).');
      return;
    }

    const unitPrice = Number(selectedProduct.price || 0);
    const totalAmount = unitPrice * quantity;

    const saleData = {
      customerName: customerName.trim(),
      productId: selectedProduct.id,
      productName: `${selectedProduct.brand || ''} ${selectedProduct.model || ''} ${selectedProduct.size || ''}`.trim(),
      quantity,
      unitPrice,
      totalAmount,
      createdAt: Timestamp.now(), // Firestore Timestamp for creation date
      type: 'in-store', // Example type
      status: 'completed', // Example status
    };

    try {
      // Add sale record to 'sales' collection
      await addDoc(collection(db, 'sales'), saleData);
      
      // Update product stock in 'products' collection
      await updateDoc(doc(db, 'products', selectedProduct.id), {
        stock: selectedProduct.stock - quantity,
      });

      // Reset form fields after successful submission
      setCustomerName('');
      setSelectedProduct(null);
      setSearchTerm('');
      setQuantity(1);
      setShowForm(false); // Close the form
      setMessage('Sale recorded successfully!'); // Success message
    } catch (err) {
      console.error('Sale transaction failed:', err);
      // Display specific error message from Firebase if available
      setMessage(`Failed to record sale: ${err.message || 'Unknown error'}. Please check console for details.`);
    }
  };

  // Function to open the sales form
  const openSalesForm = () => {
    setCustomerName('');
    setSearchTerm('');
    setFilteredProducts(products); // Reset product search results
    setSelectedProduct(null);
    setQuantity(1);
    setMessage(''); // Clear any previous messages
    setShowForm(true);
  };

  // Function to close the sales form
  const closeSalesForm = () => {
    setShowForm(false);
    setMessage(''); // Clear messages on close
  };

  return (
    <StaffLayout>
      <div className="sales-container"> {/* Main container, using a class that you might define in StaffSales.css */}
        <div className="sales-header"> {/* Header for the page */}
          <h1>Sales Transactions</h1>
          <button onClick={openSalesForm} className="add-transaction-btn">
            + Add Transaction
          </button>
        </div>

        {/* Custom Message Display */}
        {message && (
          <div className={`message-box ${message.includes('Error') || message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Sales Modal/Form */}
        {showForm && (
          <div className="sales-modal-overlay"> {/* Overlay for the modal */}
            <div className="sales-form-card"> {/* Card for the form */}
              <h2>New Sale</h2>

              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="form-input"
              />

              <div className="search-section">
                <input
                  type="text"
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input search-input"
                />
                <button onClick={handleSearch} className="search-btn">Search</button>
              </div>

              <div className="search-results-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className={`product-result-card ${
                        selectedProduct?.id === p.id ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedProduct(p)}
                    >
                      <strong>{p.brand} {p.model} {p.size}</strong>
                      <p>₱{Number(p.price || 0).toFixed(2)} — {p.stock} in stock</p>
                    </div>
                  ))
                ) : (
                  <p className="no-products-found">No products found. Try a different search term.</p>
                )}
              </div>

              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="form-input"
                disabled={!selectedProduct} // Disable quantity input if no product is selected
              />
              {selectedProduct && quantity > selectedProduct.stock && (
                  <p className="text-red-500 text-sm mt-1">Quantity exceeds available stock ({selectedProduct.stock}).</p>
              )}


              <div className="form-buttons">
                <button onClick={handleSubmit} className="submit-btn">Submit</button>
                <button onClick={closeSalesForm} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Sales Log Table */}
        <div className="sales-table-container"> {/* Container for table, using a class that you might define in StaffSales.css */}
          <table className="sales-table"> {/* Using a class that you might define in StaffSales.css */}
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
              {salesLog.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center-cell no-sales-data">No sales yet.</td>
                </tr>
              ) : (
                salesLog.map((log) => (
                  <tr key={log.id}>
                    <td>{log.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                    <td>{log.customerName || 'N/A'}</td>
                    <td>{log.productName || 'N/A'}</td>
                    <td>{log.quantity || 0}</td>
                    <td>₱{Number(log.unitPrice || 0).toFixed(2)}</td>
                    <td>₱{Number(log.totalAmount || 0).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffSales;
