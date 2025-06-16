import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import {
  ref, uploadBytes, getDownloadURL
} from 'firebase/storage';
import '../../styles/AdminDashboard.css';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({
    id: '', name: '', category: '', stock: '', price: '', description: '', image: null
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
    id: '', name: '', category: '', stock: '', price: '', description: '', image: null
  });

  const handleImageUpload = async (file) => {
    const imageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';

      if (formData.image instanceof File) {
        imageUrl = await handleImageUpload(formData.image);
      } else if (formMode === 'edit') {
        imageUrl = formData.image; // keep existing
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        stock: Number(formData.stock),
        price: parseFloat(formData.price),
        description: formData.description,
        image: imageUrl,
        weight: 'N/A',
        dimensions: 'N/A'
      };

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
  console.log("Add Product clicked");
  setFormMode('add');
  resetFormData();
  setIsFormModalOpen(true);
};


  const handleEditProduct = (product) => {
    setFormMode('edit');
    setFormData({
      ...product,
      image: product.image || null
    });
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
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: (name === 'stock' || name === 'price') ? Number(value) : value
      }));
    }
  };

  const getStockStatusClass = (stock) =>
    stock > 20 ? 'stock-high' : stock > 5 ? 'stock-medium' : 'stock-low';

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
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/100x100?text=No+Img';
                        }}
                      />
                      {product.name}
                    </td>
                    <td>{product.category}</td>
                    <td><span className={getStockStatusClass(product.stock)}>{product.stock} in stock</span></td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleViewDetails(product)}>View</button>
                      <button onClick={() => handleEditProduct(product)}>Edit</button>
                      <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
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
            <h2>{selectedProduct.name}</h2>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="modal-product-image"
            />
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Stock:</strong> {selectedProduct.stock}</p>
            <p><strong>Price:</strong> ${selectedProduct.price.toFixed(2)}</p>
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
              <div className="form-group">
                <label htmlFor="image">Product Photo:</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFormChange}
                  required={formMode === 'add'}
                />
              </div>
              {['name', 'category', 'stock', 'price'].map((field) => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                    type={field === 'stock' || field === 'price' ? 'number' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleFormChange}
                    required
                    min={field === 'stock' ? "0" : undefined}
                    step={field === 'price' ? "0.01" : undefined}
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
