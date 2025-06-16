import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ViewProduct.css";

const sampleProducts = [
  {
    id: 1,
    name: "GUARD",
    brand: "BLACK RHINO",
    finish: "MATTE BLACK",
    image: "/img1.jpg",
    gallery: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
    description:
      "Take on the trails with the Black Rhino Guard BR028. Built tough and ready to roll deep into the wild. This wheel features a bold, angular five-spoke face with deep cuts and a detailed 3D lip that flexes off-road aggression proudly. It comes in a 17x8.5\" size with a 0mm offset, built to handle the abuse of serious trails. Perfect for crawling over rocks or hammering down technical tracks where strength and clearance matter. With fitments ideal for rigs like the Toyota Tacoma, Jeep Wrangler, Ford Bronco, and 4Runner, the BR028 Guard looks right at home in the dirt."
  }
];

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = sampleProducts.find(
    (p) => p.id === parseInt(id, 10)
  );

  const [selectedImage, setSelectedImage] = useState(product?.image);

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="view-product">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="product-container">
        <div className="product-images">
          <img src={selectedImage} alt="Main" className="main-image" />
          <div className="thumbnail-row">
            {product.gallery.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt={`thumb-${idx}`}
                className={`thumbnail${selectedImage === img ? " active" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <span className="tag">NEW</span>
          <h2 className="brand-logo">{product.brand}</h2>
          <h1 className="product-name">{product.name}</h1>
          <p className="review-label">Be The First To Review This Product</p>
          <p className="finish-label">
            <strong>Finish</strong> {product.finish}
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
            <span role="img" aria-label="fitment">🚗</span>
            {" "}This product is fitment specific.{" "}
            <a href="#">Select a vehicle</a> to see if this fits.
          </div>

          <details className="desc-section" open>
            <summary>Description</summary>
            <p>{product.description}</p>
          </details>

          <details className="details-section">
            <summary>Product Details</summary>
            <p>
              More specifications can go here (diameter, width, bolt pattern, etc.)
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;