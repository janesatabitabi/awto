import React, { useState, useEffect } from 'react';

const initialMockProducts = [
  {
    id: 'prod001',
    name: 'Michelin Pilot Sport 4',
    category: 'Passenger Car Tires',
    stock: 50,
    price: 180.00,
    description: 'High-performance summer tire offering excellent grip and handling. Known for its exceptional wet and dry performance.',
    weight: '10 kg',
    dimensions: '225/45R17',
    image: 'https://placehold.co/100x100/A0D9D9/333333?text=Tire+A'
  },
  {
    id: 'prod002',
    name: 'Goodyear Wrangler All-Terrain',
    category: 'SUV/Light Truck Tires',
    stock: 30,
    price: 220.50,
    description: 'Durable all-terrain tire suitable for both on and off-road driving. Features an aggressive tread pattern for traction.',
    weight: '15 kg',
    dimensions: '265/70R16',
    image: 'https://placehold.co/100x100/F0B27A/333333?text=Tire+B'
  },
  {
    id: 'prod003',
    name: 'Pirelli Cinturato P7',
    category: 'Passenger Car Tires',
    stock: 75,
    price: 150.75,
    description: 'Eco-friendly touring tire designed for comfort and fuel efficiency. Provides a quiet and smooth ride.',
    weight: '9 kg',
    dimensions: '205/55R16',
    image: 'https://placehold.co/100x100/C0C0C0/333333?text=Tire+C'
  },
  {
    id: 'prod004',
    name: 'BFGoodrich Mud-Terrain T/A KM3',
    category: 'Off-Road Tires',
    stock: 15,
    price: 300.00,
    description: 'Extreme off-road tire with excellent traction in mud and soft soil. Built for rugged conditions and maximum durability.',
    weight: '20 kg',
    dimensions: '33X12.50R15',
    image: 'https://placehold.co/100x100/87CEEB/333333?text=Tire+D'
  }
];

// Main Products component
const Products = () => {
  // Initialize state from localStorage, or use initialMockProducts if empty
  const [products, setProducts] = useState(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      return storedProducts ? JSON.parse(storedProducts) : initialMockProducts;
    } catch (error) {
      console.error("Failed to read products from localStorage:", error);
      return initialMockProducts;
    }
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    stock: '',
    price: '',
    description: '',
    image: ''
  });

  // Save products to localStorage whenever the products state changes
  useEffect(() => {
    try {
      localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save products to localStorage:", error);
    }
  }, [products]); // Dependency array includes 'products' so this runs on every change

  // --- Utility Functions ---
  const generateProductId = () => {
    return 'prod' + Math.random().toString(36).substr(2, 9);
  };

  const resetFormData = () => {
    setFormData({
      id: '',
      name: '',
      category: '',
      stock: '',
      price: '',
      description: '',
      image: ''
    });
  };

  // --- Handlers for Product Actions ---

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = () => {
    setFormMode('add');
    resetFormData();
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setFormMode('edit');
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      description: product.description,
      image: product.image
    });
    setIsFormModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: (name === 'stock' || name === 'price') ? Number(value) : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (formMode === 'add') {
      const newProduct = {
        ...formData,
        id: generateProductId(),
        weight: 'N/A',
        dimensions: 'N/A'
      };
      setProducts([...products, newProduct]);
    } else {
      setProducts(products.map(product =>
        product.id === formData.id ? { ...product, ...formData } : product
      ));
    }
    setIsFormModalOpen(false);
    resetFormData();
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    resetFormData();
  };

  const getStockStatusClass = (stock) => {
    if (stock > 20) return 'stock-high';
    if (stock > 5) return 'stock-medium';
    return 'stock-low';
  };

  return (
    <div className="products-page-container">
      {/* Embedded CSS remains the same */}
      <style>
        {`
        /* Keyframe animations for modal */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        /* Overall page container */
        .products-page-container {
          padding: 2rem;
          background: linear-gradient(135deg, #f9fafb 0%, #e0e7ed 100%);
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: #333;
        }

        /* Page title */
        .products-page-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e40af;
          margin-bottom: 2rem;
          padding-bottom: 0.5rem;
          border-bottom: 4px solid #93c5fd;
          display: inline-block;
          border-radius: 0.375rem;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }

        /* Product overview card */
        .product-overview-card {
          background-color: #ffffff;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          margin-bottom: 2rem; /* Added margin for spacing */
        }

        .product-overview-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 1.5rem;
        }

        .no-products-message {
          color: #718096;
          font-size: 1.125rem;
          text-align: center;
          padding-top: 3rem;
          padding-bottom: 3rem;
        }

        /* Add Product Button */
        .add-product-button-container {
          text-align: right;
          margin-bottom: 1.5rem;
        }

        .add-product-button {
          background-color: #10b981;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          border: none;
          cursor: pointer;
          font-weight: 600;
          outline: none;
        }

        .add-product-button:hover {
          background-color: #059669;
          transform: scale(1.03);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .add-product-button:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.5);
        }


        /* Product table styling */
        .product-table-wrapper {
          overflow-x: auto;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
        }

        .product-table {
          width: 100%;
          border-collapse: collapse;
        }

        .product-table thead {
          background-color: #2563eb;
        }

        .table-header-row th {
          padding: 1rem 1.5rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .table-header-row th:first-child {
          border-top-left-radius: 0.5rem;
        }

        .table-header-row th:last-child {
          border-top-right-radius: 0.5rem;
          text-align: center;
        }

        .product-table tbody {
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
        }

        .table-row {
          transition: background-color 0.15s ease-in-out;
        }

        .table-row:hover {
          background-color: #eff6ff;
        }

        .table-row.even-row {
          background-color: #f9fafb;
        }

        .table-row.odd-row {
          background-color: #ffffff;
        }

        .table-data {
          padding: 1rem 1.5rem;
          white-space: nowrap;
          font-size: 0.875rem;
          color: #4a5568;
        }

        .product-cell {
          font-weight: 500;
          color: #1a202c;
          display: flex;
          align-items: center;
        }

        .product-image {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          object-fit: cover;
          margin-right: 0.75rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .stock-status-badge {
          padding: 0.25rem 0.5rem;
          display: inline-flex;
          font-size: 0.75rem;
          line-height: 1.25rem;
          font-weight: 600;
          border-radius: 9999px;
        }

        .stock-high {
          background-color: #d1fae5;
          color: #065f46;
        }

        .stock-medium {
          background-color: #fef3c7;
          color: #92400e;
        }

        .stock-low {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .product-price {
          font-weight: 600;
          color: #1d4ed8;
        }

        .actions-cell {
          text-align: center;
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          white-space: normal;
        }

        .action-button {
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
        }

        .view-details-button {
          background-color: #3b82f6;
          color: #ffffff;
        }
        .view-details-button:hover {
          background-color: #2563eb;
          transform: translateY(-2px);
        }

        .edit-button {
          background-color: #f59e0b;
          color: #ffffff;
        }
        .edit-button:hover {
          background-color: #d97706;
          transform: translateY(-2px);
        }

        .delete-button {
          background-color: #ef4444;
          color: #ffffff;
        }
        .delete-button:hover {
          background-color: #dc2626;
          transform: translateY(-2px);
        }

        /* Modal Styling (for Product Details) */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.6);
          padding: 1rem;
          animation: fadeIn 0.3s ease-out forwards;
        }

        .modal-content {
          background-color: #ffffff;
          border-radius: 1rem;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          width: 100%;
          max-width: 32rem;
          border: 1px solid #e2e8f0;
          animation: slideUp 0.3s ease-out forwards;
          position: relative; /* For close button positioning */
        }

        .modal-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1d4ed8;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #bfdbfe;
          text-align: center;
        }

        .modal-image-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .modal-product-image {
          width: 8rem;
          height: 8rem;
          border-radius: 9999px;
          object-fit: cover;
          border: 4px solid #bfdbfe;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          color: #4a5568;
          font-size: 1.125rem;
        }

        .modal-details-grid p strong {
          color: #1a202c;
        }

        .modal-details-grid p span {
          font-weight: 500;
        }

        .modal-details-grid p:nth-child(3) span { /* Price span */
          font-weight: 700;
          color: #059669;
        }

        .modal-description {
          color: #4a5568;
          font-style: italic;
        }

        .modal-actions {
          margin-top: 2rem;
          text-align: right;
        }

        .modal-close-button {
          background-color: #2563eb;
          color: #ffffff;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          border: none;
          cursor: pointer;
          outline: none;
        }

        .modal-close-button:hover {
          background-color: #1e40af;
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .modal-close-button:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
        }

        /* Form Modal Styling */
        .form-modal-content {
          background-color: #ffffff;
          border-radius: 1rem;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          width: 100%;
          max-width: 36rem; /* Back to original wider size for more fields */
          border: 1px solid #e2e8f0;
          animation: slideUp 0.3s ease-out forwards;
          position: relative;
        }

        .form-modal-title {
          font-size: 2rem;
          font-weight: 700;
          color: #059669;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #a7f3d0;
          text-align: center;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e0;
          border-radius: 0.5rem;
          font-size: 1rem;
          color: #4a5568;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
        }

        .form-actions {
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .form-submit-button,
        .form-cancel-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          border: none;
        }

        .form-submit-button:hover {
          background-color: #16a34a;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-cancel-button {
          background-color: #ef4444;
          color: #ffffff;
        }

        .form-cancel-button:hover {
          background-color: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Responsive adjustments */
        @media (min-width: 768px) {
          .modal-details-grid {
            grid-template-columns: 1fr 1fr;
          }

          .modal-details-grid p:nth-child(4) { /* Description field */
            grid-column: span 2;
          }
        }
        `}
      </style>
      <h1 className="products-page-title">
        Product Catalog
      </h1>

      <div className="product-overview-card">
        <div className="add-product-button-container">
          <button onClick={handleAddProduct} className="add-product-button">
            + Add New Product
          </button>
        </div>

        {products.length === 0 ? (
          <p className="no-products-message">
            No products found. Add new products to see them here!
          </p>
        ) : (
          <div className="product-table-wrapper">
            <table className="product-table">
              <thead>
                <tr className="table-header-row">
                  <th scope="col" className="table-header product-column">
                    Product
                  </th>
                  <th scope="col" className="table-header">
                    Category
                  </th>
                  <th scope="col" className="table-header">
                    Stock
                  </th>
                  <th scope="col" className="table-header">
                    Price
                  </th>
                  <th scope="col" className="table-header actions-column">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className={`table-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                    <td className="table-data product-cell">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/CCCCCC/666666?text=No+Img'; }}
                      />
                      {product.name}
                    </td>
                    <td className="table-data">
                      {product.category}
                    </td>
                    <td className="table-data">
                      <span className={`stock-status-badge ${getStockStatusClass(product.stock)}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="table-data">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                    </td>
                    <td className="table-data actions-cell">
                      <button
                        onClick={() => handleViewDetails(product)}
                        className="action-button view-details-button"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="action-button edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="action-button delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {selectedProduct.name}
            </h2>
            <div className="modal-image-wrapper">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="modal-product-image"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/CCCCCC/666666?text=No+Img'; }}
              />
            </div>
            <div className="modal-details-grid">
              <p><strong>Category:</strong> <span>{selectedProduct.category}</span></p>
              <p><strong>Stock:</strong> <span>{selectedProduct.stock} units</span></p>
              <p><strong>Price:</strong> <span>${selectedProduct.price.toFixed(2)}</span></p>
              <p><strong>Weight:</strong> <span>{selectedProduct.weight}</span></p>
              <p><strong>Dimensions:</strong> <span>{selectedProduct.dimensions}</span></p>
              <p className="modal-description"><strong>Description:</strong> <span>{selectedProduct.description}</span></p>
            </div>
            <div className="modal-actions">
              <button
                onClick={handleCloseModal}
                className="modal-close-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Form Modal - WITH CATEGORY AND STOCK */}
      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="form-modal-content">
            <h2 className="form-modal-title">
              {formMode === 'add' ? 'Add New Product' : 'Edit Product'}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="image">Photo (Image URL):</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  placeholder="e.g., https://example.com/product-image.jpg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Product Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock:</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price ($):</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCloseFormModal}
                  className="form-cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="form-submit-button"
                >
                  {formMode === 'add' ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;