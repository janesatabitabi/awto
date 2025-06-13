// SendOTP.jsx
import { doc, setDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser'; // keep this if working
import { db } from '../firebase';

/**
 * Generates a 6-digit OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends an OTP email and stores OTP in Firestore
 * @param {object} user - User object with at least uid and email
 */
export const sendOTPEmail = async (user) => {
  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  try {
    // Optional: Store user's email and unverified state
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      isOTPVerified: false,
      role: 'user'
    });

    // Save OTP to Firestore (2FA collection)
    await setDoc(doc(db, '2fa', user.uid), {
      lastOTP: otp,
      expiresAt,
      otp: true
    });

    // Prepare EmailJS template params
    const templateParams = {
      email: user.email,      // must match {{email}} in your EmailJS template
      passcode: otp           // must match {{passcode}} in your EmailJS template
    };

    // Send OTP email using EmailJS
    const result = await emailjs.send(
      'service_b2k1tzs',       // your actual service ID
      'template_0stzxse',      // your actual template ID
      templateParams,
      'fxJ47rab2fQziSaDE'      // your public key from EmailJS
    );

    console.log('✅ OTP email sent:', result.status);
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw error;
  }
};
