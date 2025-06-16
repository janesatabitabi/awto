import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed
import "../styles/CatalogBox.css";

const CatalogBox = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(fetched);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleView = (id) => {
    navigate(`/view-product/${id}`);
  };

  return (
    <div className="catalog">
      <div className="catalog-controls">
        <select>
          <option value="48">View: 48</option>
        </select>
        <select>
          <option value="featured">Sort By: Featured</option>
        </select>
      </div>

      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card" onClick={() => handleView(product.id)}>
              <div className="tag">NEW</div>
              <img
                src={product.image || "https://placehold.co/150x150?text=No+Image"}
                alt={product.name}
                className="product-img"
              />
              <h4 className="product-name">{product.name}</h4>
              <p className="product-brand">{product.category || "—"}</p>
              <p className="product-price">${product.price}</p>
              <div className="product-rating">★★★★☆ 1 Review</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CatalogBox;
