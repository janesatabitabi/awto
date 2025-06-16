import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import '../../styles/AdminDashboard.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({
    id: '', brand: '', model: '', size: '', price: '', description: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const resetFormData = () => setFormData({
    id: '', brand: '', model: '', size: '', price: '', description: ''
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      brand: formData.brand,
      model: formData.model,
      size: formData.size,
      price: parseFloat(formData.price),
      description: formData.description
    };

    try {
      if (formMode === 'add') {
        const docRef = await addDoc(collection(db, 'products'), productData);
        setProducts(prev => [...prev, { ...productData, id: docRef.id }]);
      } else {
        await updateDoc(doc(db, 'products', formData.id), productData);
        setProducts(prev =>
          prev.map(p => (p.id === formData.id ? { ...p, ...productData } : p))
        );
      }

      setIsFormModalOpen(false);
      resetFormData();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleAddProduct = () => {
    setFormMode('add');
    resetFormData();
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setFormMode('edit');
    setFormData(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    resetFormData();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="products-page-container">
      <h1 className="products-page-title">Product Catalog</h1>
      <div className="product-overview-card">
        <div className="add-product-button-container">
          <button onClick={handleAddProduct} className="add-product-button">+ Add New Product</button>
        </div>
        {products.length === 0 ? (
          <p className="no-products-message">No products found. Add new products to see them here!</p>
        ) : (
          <div className="product-table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td>{product.brand}</td>
                    <td>{product.model}</td>
                    <td>{product.size}</td>
                    <td>₱{parseFloat(product.price).toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleViewDetails(product)}>View</button>
                        <button onClick={() => handleEditProduct(product)}>Edit</button>
                        <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedProduct.brand} - {selectedProduct.model}</h2>
            <p><strong>Size:</strong> {selectedProduct.size}</p>
            <p><strong>Price:</strong> ₱{selectedProduct.price.toFixed(2)}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="form-modal-content">
            <h2>{formMode === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
            <form onSubmit={handleFormSubmit}>
              {['brand', 'model', 'size', 'price'].map((field) => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                    type={field === 'price' ? 'number' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleFormChange}
                    required
                    step={field === 'price' ? '0.01' : undefined}
                  />
                </div>
              ))}
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCloseFormModal}>Cancel</button>
                <button type="submit">{formMode === 'add' ? 'Add Product' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
