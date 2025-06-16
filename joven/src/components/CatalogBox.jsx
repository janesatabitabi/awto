import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CatalogBox.css";

const CatalogBox = () => {
  const navigate = useNavigate();

  const products = [
    { id: 1, name: "AMERICAN RACING GT STREET", brand: "Flow Formed Aluminum", image: "/img1.jpg", price: 220 },
    { id: 2, name: "AMERICAN RACING G-FORCE", brand: "Flow Formed Aluminum", image: "/img2.jpg", price: 220 },
    { id: 3, name: "AMERICAN RACING 500 MONO CAST", brand: "Cast Aluminum", image: "/img3.jpg", price: 210 },
    { id: 4, name: "AMERICAN RACING AR23", brand: "Cast Aluminum", image: "/img4.jpg", price: 205 }
  ];

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
        {products.map((product) => (
          <div key={product.id} className="product-card" onClick={() => handleView(product.id)}>
            <div className="tag">NEW</div>
            <img src={product.image} alt={product.name} className="product-img" />
            <h4 className="product-name">{product.name}</h4>
            <p className="product-brand">{product.brand}</p>
            <p className="product-price">${product.price}</p>
            <div className="product-rating">★★★★☆ 1 Review</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogBox;
