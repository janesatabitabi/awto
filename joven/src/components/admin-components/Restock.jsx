// src/components/admin-page/Restock.jsx
import React from 'react';
import '../../styles/admin-styles/Inventory.css';

const Restock = ({
  searchValue,
  setSearchValue,
  onSearch,
  restockList,
  onChangeQty,
  onClose,
  onSave,
}) => {
  return (
    <div className="restock-modal">
      <h2 className="restock-title">Restock Products</h2>

      <input
        type="text"
        placeholder="Search product by ID or Name..."
        className="search-bar"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button className="restock-search-btn" onClick={onSearch}>Search</button>

      <div className="restock-list">
        {restockList.map((item) => (
          <div key={item.id} className="restock-item">
            <span>{item.brand} {item.model} ({item.size})</span>
            <input
              type="number"
              className="stock-input"
              value={item.qty}
              onChange={(e) => onChangeQty(e, item.id)}
              min="0"
            />
          </div>
        ))}
      </div>

      <div className="restock-actions">
        <button className="submit-btn" onClick={onSave}>Save Changes</button>
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Restock;
