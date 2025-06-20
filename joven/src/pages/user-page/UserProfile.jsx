// src/pages/user-page/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import "../../styles/UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [photoURL, setPhotoURL] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);

  const fetchUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setUserData(userSnap.data());
      setPhotoURL(userSnap.data().photoURL || "");
    }
  };

  const fetchUserOrders = async (uid) => {
    const q = query(collection(db, "reservations"), where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    const userOrders = [];
    querySnapshot.forEach((doc) => {
      userOrders.push({ id: doc.id, ...doc.data() });
    });
    setOrders(userOrders);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user.uid);
        await fetchUserOrders(user.uid);
        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    if (selectedFile) {
      const imageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(imageRef, selectedFile);
      const url = await getDownloadURL(imageRef);
      setPhotoURL(url);
      await updateDoc(userRef, {
        ...userData,
        photoURL: url
      });
    } else {
      await updateDoc(userRef, userData);
    }

    alert("Profile updated successfully!");
  };

  if (loading) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="user-profile-page">
      <aside className="profile-sidebar">
        <h2>My Account</h2>
        <ul>
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </li>
          <li
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </li>
          <li onClick={() => auth.signOut()}>Logout</li>
        </ul>
      </aside>

      <main className="profile-content">
        {activeTab === "profile" && (
          <>
            <h2>Profile Information</h2>
            <div className="profile-photo-section">
              <img src={photoURL || "/default-profile.png"} alt="Profile" />
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="profile-form">
              <input
                type="text"
                name="name"
                value={userData.name || ""}
                onChange={handleInputChange}
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={userData.email || ""}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="gender"
                value={userData.gender || ""}
                onChange={handleInputChange}
                placeholder="Gender"
              />
              <input
                type="date"
                name="birthday"
                value={userData.birthday || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="address"
                value={userData.address || ""}
                onChange={handleInputChange}
                placeholder="Address"
              />
              <button onClick={handleSave}>Save Changes</button>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <>
            <h2>My Orders</h2>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <p><strong>Product:</strong> {order.productName}</p>
                    <p><strong>Brand:</strong> {order.brand}</p>
                    <p><strong>Size:</strong> {order.size}</p>
                    <p><strong>Date:</strong> {order.preferredDateTime}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <button
                      className="invoice-button"
                      onClick={() => navigate(`/invoice/${order.id}`)}
                    >
                      View Invoice
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
