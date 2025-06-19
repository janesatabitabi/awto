// src/pages/staff-page/StaffInventory.jsx
import React, { useEffect, useState } from 'react';
// Corrected path for firebase.js
// It is at src/firebase.js, and StaffInventory.jsx is at src/pages/staff-page/StaffInventory.jsx
import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  doc, // Added for updateDoc
  updateDoc, // Added for restock functionality
  serverTimestamp, // Added for restock functionality
} from 'firebase/firestore';
// IMPORTANT: Path for StaffLayout.jsx
// Based on your previous screenshot, StaffLayout.jsx is located at:
// C:/Users/kulet/Desktop/capstone/awto/joven/src/pages/staff-page/StaffLayout.jsx
// Since it's in the SAME directory as StaffInventory.jsx, the relative path is './StaffLayout'.
import StaffLayout from './StaffLayout';
import '../../styles/staff-styles/StaffInventory.css'; // Now importing the adapted CSS
import Restock from '../../components/admin-components/Restock'; // Assuming Restock component is here

const StaffInventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('id-asc');

  // States for Restock functionality
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockList, setRestockList] = useState([]);
  const [restockSearch, setRestockSearch] = useState('');
  const [message, setMessage] = useState(''); // State for custom messages

  // Fetch products from Firestore
  useEffect(() => {
    // Set up a real-time listener for the 'products' collection
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    }, (error) => {
      console.error("Error fetching products:", error);
      setMessage("Error loading products. Please try again.");
    });

    // Clean up the listener when the component unmounts
    return () => unsub();
  }, []); // Empty dependency array means this effect runs once on mount

  // Filter and sort products whenever products, searchTerm, or sortOption changes
  useEffect(() => {
    let filtered = [...products]; // Start with a copy of all products

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
        `${p.productId} ${p.brand} ${p.model} ${p.size}`.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply sorting based on selected option
    switch (sortOption) {
      case 'id-asc':
        filtered.sort((a, b) => {
          const idA = parseInt(a.productId) || 0; // Parse as int, default to 0 if not a number
          const idB = parseInt(b.productId) || 0;
          return idA - idB; // Ascending sort
        });
        break;
      case 'id-desc':
        filtered.sort((a, b) => {
          const idA = parseInt(a.productId) || 0;
          const idB = parseInt(b.productId) || 0;
          return idB - idA; // Descending sort
        });
        break;
      case 'stock-asc':
        filtered.sort((a, b) => Number(a.stock) - Number(b.stock)); // Ascending stock
        break;
      case 'stock-desc':
        filtered.sort((a, b) => Number(b.stock) - Number(a.stock)); // Descending stock
        break;
      case 'modified-latest':
        filtered.sort((a, b) => {
          // Convert Firestore Timestamps to milliseconds for comparison
          const aTime = a.dateModified?.toMillis?.() || 0;
          const bTime = b.dateModified?.toMillis?.() || 0;
          return bTime - aTime; // Latest modified first
        });
        break;
      default:
        break;
    }

    setFilteredProducts(filtered); // Update the state with the filtered and sorted products
  }, [products, searchTerm, sortOption]); // Re-run when these dependencies change

  // Functions for Restock Modal
  const openRestockModal = () => {
    setRestockList([]); // Clear previous restock items
    setRestockSearch(''); // Clear previous search term
    setMessage(''); // Clear any previous messages
    setIsRestockOpen(true);
  };

  const closeRestockModal = () => {
    setIsRestockOpen(false);
    setMessage(''); // Clear messages on close
  };

  const handleSearchRestockProduct = () => {
    const term = restockSearch.toLowerCase();
    const result = products
      .filter((p) =>
        `${p.productId} ${p.brand} ${p.model} ${p.size}`.toLowerCase().includes(term)
      )
      .map((p) => ({ ...p, qty: 0 })); // Add qty property for restock input
    setRestockList(result);
  };

  const handleRestockInput = (e, id) => {
    const qty = parseInt(e.target.value || '0'); // Ensure integer, default to 0
    setRestockList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  const saveRestocks = async () => {
    try {
      let restockedCount = 0;
      for (const item of restockList) {
        if (item.qty > 0) {
          const ref = doc(db, 'products', item.id);
          const original = products.find((p) => p.id === item.id);
          // Ensure original product exists and has a stock number
          const currentStock = Number(original?.stock || 0);
          const newStock = currentStock + Number(item.qty);

          await updateDoc(ref, {
            stock: newStock,
            dateModified: serverTimestamp(), // Update modification timestamp
          });
          restockedCount++;
        }
      }
      setIsRestockOpen(false);
      if (restockedCount > 0) {
        setMessage(`Successfully restocked ${restockedCount} product(s)!`);
      } else {
        setMessage("No products were restocked.");
      }
    } catch (err) {
      console.error('Restock failed:', err);
      setMessage('Failed to save restocks. Please try again.');
    }
  };

  return (
    <StaffLayout>
      <div className="inventory-page-container"> {/* Using Admin's class name */}
        <h1 className="inventory-page-title">📦 Inventory</h1> {/* Using Admin's class name */}

        <div className="inventory-controls"> {/* Using Admin's class name */}
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by Product Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          {/* Sort Option Select */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="id-asc">Ascending Product ID</option>
            <option value="id-desc">Descending Product ID</option>
            <option value="stock-asc">Stock Low to High</option>
            <option value="stock-desc">Stock High to Low</option>
            <option value="modified-latest">Latest Modified</option>
          </select>
          {/* Restock Button - Re-added */}
          <button onClick={openRestockModal} className="restock-btn">
            Restock
          </button>
        </div>

        {/* Custom Message Display */}
        {message && (
          <div className={`message-box ${message.includes('Error') || message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="inventory-card"> {/* Using Admin's class name */}
          <table className="inventory-table"> {/* Using Admin's class name */}
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Total Value</th>
                <th>Date Modified</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const productName = `${product.brand || ''} ${product.model || ''} ${product.size || ''}`.trim();
                  const total = (Number(product.stock || 0) * Number(product.price || 0)).toFixed(2);
                  const status = Number(product.stock) <= 4 ? 'Out of Stock' : 'In Stock';
                  const statusClassName = status === 'Out of Stock' ? 'text-red' : 'text-green'; // Using Admin's class names

                  const date = product.dateModified?.toDate?.().toLocaleString() || '—';

                  return (
                    <tr key={product.id}>
                      <td>{product.productId || product.id}</td>
                      <td>{productName}</td>
                      <td>{product.type || '—'}</td>
                      <td className={statusClassName}>
                        {status}
                      </td>
                      <td>{product.stock}</td>
                      <td>₱{Number(product.price || 0).toFixed(2)}</td>
                      <td>₱{total}</td>
                      <td>{date}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500"> {/* Using Admin's class names */}
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Restock Modal - Re-added */}
        {isRestockOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <Restock
                searchValue={restockSearch}
                setSearchValue={setRestockSearch}
                onSearch={handleSearchRestockProduct}
                restockList={restockList}
                onChangeQty={handleRestockInput}
                onClose={closeRestockModal}
                onSave={saveRestocks}
              />
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default StaffInventory;
