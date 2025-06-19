import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/CatalogBox.css";

const CatalogBox = ({ filters }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(fetched);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      setFilteredProducts(products);
      return;
    }
    const result = products.filter((product) => {
      return Object.entries(filters).every(([key, values]) => {
        const value = (product[key] || "").toString().toLowerCase();
        return values.some((v) => value.includes(v.toLowerCase()));
      });
    });
    setFilteredProducts(result);
  }, [filters, products]);

  const handleView = (id) => navigate(`/view-product/${id}`);

  return (
    <div className="catalog">
      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p>No products available.</p>
        ) : (
          filteredProducts.map((product) => {
            const size = product.size || "Unknown Size";
            const model = product.model || "Unknown Model";
            const brand = product.brand || "Unknown Brand";
            const price = product.price?.toLocaleString() || "N/A";
            const image = product.imageUrl || "https://placehold.co/150x150?text=No+Image";
            const reviewCount = product.reviews?.length || 1;

            return (
              <div
                key={product.id}
                className="product-card"
                onClick={() => handleView(product.id)}
              >
                {product.new && <div className="tag">NEW</div>}
                <img
                  src={image}
                  alt={product.name || "Product Image"}
                  className="product-img"
                  onError={(e) =>
                    (e.target.src = "https://placehold.co/150x150?text=No+Image")
                  }
                />
                <h4 className="product-name">{brand}</h4>
                <p className="product-model-size">
                  {size} {model}
                </p>
                <p className="product-price">
                  ₱{price}
                </p>
                <div className="product-rating">
                  ★★★★☆ ({reviewCount} Review{reviewCount > 1 ? "s" : ""})
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CatalogBox;
