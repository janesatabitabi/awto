import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FiShoppingCart } from "react-icons/fi";
import { db, auth } from "../firebase";
import "../styles/ViewProduct.css";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ ...data, id: docSnap.id });
          setMainImage(data.images?.[0] || data.imageUrl || "");
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleReserveClick = () => {
    navigate(`/reserve/${product.id}`);
  };

  const handleAddToCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to add to selections.");
      return;
    }

    try {
      const cartRef = collection(db, "cartSelections");
      const q = query(
        cartRef,
        where("userId", "==", user.uid),
        where("productId", "==", product.id)
      );
      const existing = await getDocs(q);

      if (!existing.empty) {
        alert("Item is already in your selections.");
        return;
      }

      await addDoc(cartRef, {
        userId: user.uid,
        productId: product.id,
        productName: product.name,
        brand: product.brand,
        price: product.price,
        createdAt: serverTimestamp(),
      });

      alert("Added to My Selections!");
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  if (!product) {
    return <div className="view-product">Loading product details...</div>;
  }

  const displayName = product.size && product.model
    ? `${product.size} ${product.model}`
    : product.name;

  return (
    <div className="view-product">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-container">
        {/* Images */}
        <div className="product-images">
          <img
            src={mainImage || "https://placehold.co/300x300?text=No+Image"}
            alt="Main"
            className="main-image"
            onError={(e) =>
              (e.target.src = "https://placehold.co/300x300?text=No+Image")
            }
          />
          <div className="thumbnail-row">
            {(product.images || []).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <span className="tag">NEW</span>

          <h2 className="brand-logo">{product.brand || "No Brand"}</h2>
          <h1 className="product-name">{displayName}</h1>
          <p className="review-label">Be The First To Review This Product</p>

          <p className="detail-line">
            <strong>Finish:</strong> {product.finish || "N/A"}
          </p>

          <p className="price">
            <strong>Price:</strong> ₱{product.price?.toLocaleString() || "N/A"}
          </p>

          <div className="options-section">
            <label htmlFor="options-select">Options:</label>
            <select id="options-select">
              <option value="front-rear">Front and Rear</option>
            </select>
            <input
              type="number"
              min="1"
              defaultValue="4"
              className="qty-input"
            />
          </div>

          <div className="fitment-warning">
            🚗 This product is fitment specific.{" "}
            <a href="#">Select a vehicle</a> to see if this fits.
          </div>

          <details className="desc-section" open>
            <summary>Description</summary>
            <p>{product.description || "No description available."}</p>
          </details>

          <details className="details-section">
            <summary>Product Details</summary>
            <p>
              More specifications can go here (diameter, width, bolt pattern,
              etc.)
            </p>
          </details>

          {/* Buttons */}
          <div className="button-row">
            <button className="reserve-button" onClick={handleReserveClick}>
              Reserve Now
            </button>
            <button
              className="icon-button"
              onClick={handleAddToCart}
              title="Add to My Selections"
            >
              <FiShoppingCart size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
