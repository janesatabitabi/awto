import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import "../../styles/admin-styles/Products.css";
import ResetCounterModal from '../../components/admin-components/ResetCounterModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    size: '',
    description: '',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [nextProductId, setNextProductId] = useState(null);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchNextProductId = async () => {
    const counterRef = doc(db, 'metadata', 'productCounter');
    const counterSnap = await getDoc(counterRef);
    if (counterSnap.exists()) {
      setNextProductId(counterSnap.data().current + 1);
    } else {
      setNextProductId(1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyAdminPassword = async () => {
    const input = prompt('To confirm, enter the admin password:');
    if (!input) return false;

    const adminRef = doc(db, 'settings', 'admin');
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
      const storedPassword = adminSnap.data().password;
      return input === storedPassword;
    } else {
      alert("Admin password not found in Firestore.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode && selectedProduct) {
      await updateDoc(doc(db, 'products', selectedProduct.id), formData);
    } else {
      const counterRef = doc(db, 'metadata', 'productCounter');
      const counterSnap = await getDoc(counterRef);
      let newId = 1;
      if (counterSnap.exists()) {
        newId = counterSnap.data().current + 1;
      }

      await addDoc(collection(db, 'products'), {
        ...formData,
        productId: newId,
        createdAt: serverTimestamp(),
      });

      await setDoc(counterRef, { current: newId });
    }

    setIsModalOpen(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      brand: product.brand,
      model: product.model,
      price: product.price,
      size: product.size,
      description: product.description,
    });
    setNextProductId(product.productId || 'N/A');
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await verifyAdminPassword();
    if (confirmed) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } else {
      alert('Incorrect password. Deletion cancelled.');
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = await verifyAdminPassword();
    if (!confirmed) {
      alert('Incorrect password. Bulk deletion cancelled.');
      return;
    }
    for (const id of selectedProducts) {
      await deleteDoc(doc(db, 'products', id));
    }
    setSelectedProducts([]);
    fetchProducts();
  };

  const toggleProductSelection = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredProducts.map((p) => p.id);
      setSelectedProducts(allIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="products-page-container">
      <h1 className="products-page-title">Products</h1>
      <div className="controls-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="add-product-button"
          onClick={() => {
            setIsEditMode(false);
            setFormData({ brand: '', model: '', price: '', size: '', description: '' });
            fetchNextProductId();
            setIsModalOpen(true);
          }}
        >
          Add New Product
        </button>
        <button
          className="add-product-button"
          onClick={() => setShowResetModal(true)}
        >
          Reset Product ID Counter
        </button>
        {selectedProducts.length > 0 && (
          <button className="delete-button" onClick={handleBulkDelete}>
            Delete Selected ({selectedProducts.length})
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-products-message">No products found.</p>
      ) : (
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Brand</th>
                <th>Model</th>
                <th>Price</th>
                <th>Size</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                    />
                  </td>
                  <td>{product.brand}</td>
                  <td>{product.model}</td>
                  <td>{product.price}</td>
                  <td>{product.size}</td>
                  <td>{product.description}</td>
                  <td className="action-buttons">
                    <button onClick={() => setViewProduct(product)}>View</button>
                    <button onClick={() => handleEdit(product)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="form-modal-content">
            <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product ID</label>
                <input type="text" value={nextProductId ?? 'Loading...'} readOnly />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Size</label>
                <input type="text" name="size" value={formData.size} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </div>
              <div className="form-actions">
                <button type="submit">{isEditMode ? 'Update' : 'Add'} Product</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Product Details</h2>
            <p><strong>Product ID:</strong> {viewProduct.productId}</p>
            <p><strong>Brand:</strong> {viewProduct.brand}</p>
            <p><strong>Model:</strong> {viewProduct.model}</p>
            <p><strong>Price:</strong> {viewProduct.price}</p>
            <p><strong>Size:</strong> {viewProduct.size}</p>
            <p><strong>Description:</strong> {viewProduct.description}</p>
            <button onClick={() => setViewProduct(null)}>Close</button>
          </div>
        </div>
      )}

      <ResetCounterModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} />
    </div>
  );
};

export default Products;
