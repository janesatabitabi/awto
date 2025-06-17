import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import '../../styles/admin-styles/Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm.trim() !== '') {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(p => {
        const combined = `${p.brand} ${p.model} ${p.size}`.toLowerCase();
        return combined.includes(lowerTerm);
      });
    }

    // Sort logic
    switch (sortOption) {
      case 'name-asc':
        filtered.sort((a, b) =>
          `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
        );
        break;
      case 'name-desc':
        filtered.sort((a, b) =>
          `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`)
        );
        break;
      case 'stock-asc':
        filtered.sort((a, b) => Number(a.stock) - Number(b.stock));
        break;
      case 'stock-desc':
        filtered.sort((a, b) => Number(b.stock) - Number(a.stock));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortOption]);

  const handleStockChange = (e, id) => {
    const newStock = e.target.value;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
  };

  const handleStockUpdate = async (e, id) => {
    if (e.key === 'Enter') {
      const updatedProduct = products.find((p) => p.id === id);
      try {
        const productRef = doc(db, 'products', id);
        await updateDoc(productRef, { stock: Number(updatedProduct.stock) });
        console.log('Stock updated');
      } catch (err) {
        console.error('Error updating stock:', err);
      }
    }
  };

  return (
    <div className="inventory-page-container">
      <h1 className="inventory-page-title">Inventory</h1>

      <div className="inventory-controls">
        <input
          type="text"
          placeholder="Search product..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="stock-asc">Stock Low to High</option>
          <option value="stock-desc">Stock High to Low</option>
        </select>
      </div>

      <div className="inventory-card">
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Stocks</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => {
                  const productName = `${product.brand} ${product.model} ${product.size}`;
                  const totalPrice = product.stock * product.price;

                  return (
                    <tr key={product.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                      <td>{productName}</td>
                      <td>
                        <div className="stock-cell">
                          <input
                            type="number"
                            min="0"
                            value={product.stock}
                            onChange={(e) => handleStockChange(e, product.id)}
                            onKeyDown={(e) => handleStockUpdate(e, product.id)}
                            className="stock-input"
                          />
                          {Number(product.stock) < 4 && (
                            <span className="low-stock-warning">Low Stock</span>
                          )}
                        </div>
                      </td>
                      <td>₱{Number(product.price).toFixed(2)}</td>
                      <td className="text-green-600 font-semibold">
                        ₱{Number(totalPrice).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500">
                    No matching products.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
