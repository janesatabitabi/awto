import React, { useState, useEffect } from 'react';

// Mock product data for demonstration.
// In a real application, you would fetch this from an API or Firestore.
const mockProducts = [
  {
    id: 'prod001',
    name: 'Michelin Pilot Sport 4',
    category: 'Passenger Car Tires',
    stock: 50,
    price: 180.00,
    description: 'High-performance summer tire offering excellent grip and handling. Known for its exceptional wet and dry performance.',
    weight: '10 kg',
    dimensions: '225/45R17',
    image: 'https://placehold.co/100x100/A0D9D9/333333?text=Tire+A' // Placeholder image
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
    image: 'https://placehold.co/100x100/F0B27A/333333?text=Tire+B' // Placeholder image
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
    image: 'https://placehold.co/100x100/C0C0C0/333333?text=Tire+C' // Placeholder image
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
    image: 'https://placehold.co/100x100/87CEEB/333333?text=Tire+D' // Placeholder image
  }
];

// Main Products component
const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for product details modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Simulate fetching data
    // In a real app, this would be an async call to your backend/Firestore
    const fetchProducts = () => {
      // If no products found, you can set products to an empty array
      // setProducts([]);
      setProducts(mockProducts);
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  // Function to open the details modal
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Function to close the details modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="products-page-container">
      {/* Embedded CSS for this component */}
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
        }

        .view-details-button {
          background-color: #3b82f6;
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          border: none;
          cursor: pointer;
          outline: none;
        }

        .view-details-button:hover {
          background-color: #2563eb;
          transform: scale(1.05);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .view-details-button:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
        }

        /* Modal Styling */
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
        }

        .modal-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1d4ed8;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #bfdbfe;
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
        <h2 className="product-overview-title">Product Overview</h2>

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
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/CCCCCC/666666?text=No+Img'; }}
                      />
                      {product.name}
                    </td>
                    <td className="table-data">
                      {product.category}
                    </td>
                    <td className="table-data">
                      <span className={`stock-status-badge ${
                        product.stock > 20 ? 'stock-high' :
                        product.stock > 5 ? 'stock-medium' :
                        'stock-low'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="table-data">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                    </td>
                    <td className="table-data actions-cell">
                      <button
                        onClick={() => handleViewDetails(product)}
                        className="view-details-button"
                      >
                        View Details
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
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x150/CCCCCC/666666?text=No+Img'; }}
                />
            </div>
            <div className="modal-details-grid">
              <p><strong>Category:</strong> <span>{selectedProduct.category}</span></p>
              <p><strong>Stock:</strong> <span>{selectedProduct.stock} units</span></p> {/* Corrected closing tag */}
              <p><strong>Price:</strong> <span>${selectedProduct.price.toFixed(2)}</span></p>
              <p><strong>Description:</strong> <span className="modal-description">{selectedProduct.description}</span></p>
              <p><strong>Weight:</strong> <span>{selectedProduct.weight}</span></p>
              <p><strong>Dimensions:</strong> <span>{selectedProduct.dimensions}</span></p>
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
    </div>
  );
};

export default Products;
