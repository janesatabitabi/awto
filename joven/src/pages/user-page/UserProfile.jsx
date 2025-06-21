import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  getDownloadURL,
} from "firebase/storage";
import {
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import "../../styles/UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState({});
  const [photoURL, setPhotoURL] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [reservations, setReservations] = useState([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      setUserData(data);
      setPhotoURL(data.photoURL || "");
    }
  };

  const fetchUserReservations = async (uid) => {
    const q = query(collection(db, "reservations"), where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    const userReservations = [];
    querySnapshot.forEach((doc) => {
      userReservations.push({ id: doc.id, ...doc.data() });
    });
    setReservations(userReservations);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user.uid);
        await fetchUserReservations(user.uid);
        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabFromQuery = queryParams.get("tab");
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    }
  }, [location.search]);

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

    try {
      if (selectedFile) {
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(imageRef, selectedFile);
        const url = await getDownloadURL(imageRef);
        setPhotoURL(url);
        await updateDoc(userRef, {
          ...userData,
          photoURL: url,
        });
      } else {
        await updateDoc(userRef, userData);
      }
      alert("✅ Profile updated successfully!");
    } catch (error) {
      alert("❌ Error saving profile: " + error.message);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert("✅ Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert("❌ Failed to update password: " + error.message);
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="user-profile-page">
      <aside className="profile-sidebar">
        <button className="back-home" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <h2>My Account</h2>
        <ul>
          <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Profile</li>
          <li className={activeTab === "reservations" ? "active" : ""} onClick={() => setActiveTab("reservations")}>Reservations</li>
          <li className={activeTab === "payment" ? "active" : ""} onClick={() => setActiveTab("payment")}>Payment</li>
          <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Settings</li>
          <li onClick={() => auth.signOut()}>Logout</li>
        </ul>
      </aside>

      <main className="profile-content">
        {activeTab === "profile" && (
          <>
            <h2>Profile Information (View Only)</h2>
            <div className="profile-photo-section">
              <img src={photoURL || "/default-profile.png"} alt="Profile" />
            </div>
            <div className="profile-details-view">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Gender:</strong> {userData.gender}</p>
              <p><strong>Birthday:</strong> {userData.birthday}</p>
              <p><strong>Address:</strong> {userData.address}</p>
            </div>
          </>
        )}

        {activeTab === "reservations" && (
          <>
            <h2>My Reservations</h2>
            {reservations.length === 0 ? (
              <p>No reservations found.</p>
            ) : (
              <div className="orders-list">
                {reservations.map((res) => (
                  <div key={res.id} className="order-card">
                    <p><strong>Product:</strong> {res.productName}</p>
                    <p><strong>Brand:</strong> {res.brand}</p>
                    <p><strong>Size:</strong> {res.size}</p>
                    <p><strong>Date:</strong> {res.preferredDateTime}</p>
                    <p><strong>Status:</strong> {res.status}</p>
                    <button className="invoice-button" onClick={() => navigate(`/invoice/${res.id}`)}>
                      View Invoice
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "payment" && (
          <>
            <h2>My Payments</h2>
            {reservations.length === 0 ? (
              <p>No reservations found.</p>
            ) : (
              <div className="orders-list">
                {reservations.map((res) => (
                  <div key={res.id} className="order-card">
                    <p><strong>Product:</strong> {res.productName}</p>
                    <p><strong>Date:</strong> {res.preferredDateTime}</p>
                    <p><strong>Price:</strong> ₱{res.price}</p>
                    <p><strong>Status:</strong> {res.status || "active"}</p>
                    <p><strong>Payment:</strong> {res.paymentStatus || "unpaid"}</p>

                    {res.status !== "cancelled" && res.paymentStatus !== "paid" && (
                      <button
                        className="pay-button"
                        onClick={() => navigate(`/payment/${res.id}`)}
                      >
                        Pay Now
                      </button>
                    )}

                    {res.paymentStatus === "paid" && (
                      <button
                        className="invoice-button"
                        onClick={() => navigate(`/invoice/${res.id}`)}
                      >
                        View Invoice
                      </button>
                    )}

                    {res.status === "cancelled" && (
                      <p className="cancelled-text">❌ This reservation was cancelled.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "settings" && (
          <>
            <h2>Account Settings</h2>
            <div className="profile-photo-section">
              <img src={photoURL || "/default-profile.png"} alt="Profile" />
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="profile-form">
              <input type="text" name="name" value={userData.name || ""} onChange={handleInputChange} placeholder="Name" />
              <input type="email" value={userData.email || ""} readOnly />
              <input type="text" name="gender" value={userData.gender || ""} onChange={handleInputChange} placeholder="Gender" />
              <input type="date" name="birthday" value={userData.birthday || ""} onChange={handleInputChange} />
              <input type="text" name="address" value={userData.address || ""} onChange={handleInputChange} placeholder="Address" />
              <button onClick={handleSave}>Save Changes</button>
            </div>

            <div className="password-update">
              <h3>Change Password</h3>
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button onClick={handlePasswordUpdate}>Update Password</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
