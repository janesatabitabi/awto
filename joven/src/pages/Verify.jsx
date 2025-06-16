import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { sendEmailVerification, reload } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(user?.emailVerified || false);

  useEffect(() => {
    if (!user) return;

    // Auto-send verification email if not yet sent
    if (!emailSent && !user.emailVerified) {
      sendVerificationEmail();
    }

    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) clearInterval(interval);
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [cooldown, user]);

  const sendVerificationEmail = () => {
    if (user && !user.emailVerified) {
      sendEmailVerification(user)
        .then(() => {
          setEmailSent(true);
          setCooldown(60); // 60-second cooldown
        })
        .catch((err) => {
          console.error('Verification email error:', err);
          alert('Failed to send verification email.');
        });
    }
  };

  const checkVerification = async () => {
    try {
      await reload(user);
      if (user.emailVerified) {
        setIsVerified(true);
      } else {
        alert('Email is still not verified.');
      }
    } catch (err) {
      console.error('Error reloading user:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Verify Your Email</h2>

        {!isVerified ? (
          <>
            <p className="text-gray-700 mb-4">
              We've sent a verification email to <strong>{user?.email}</strong>.
              <br />
              Please check your inbox (or spam folder).
            </p>

            {cooldown > 0 ? (
              <p className="text-gray-500 mb-4">Resend available in {cooldown}s</p>
            ) : (
              <button
                onClick={sendVerificationEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
              >
                Resend Verification Email
              </button>
            )}

            <button
              onClick={checkVerification}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              I’ve already verified. Check again.
            </button>
          </>
        ) : (
          <>
            <p className="text-green-600 font-semibold mb-4">
              Your email is now verified! 🎉
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
