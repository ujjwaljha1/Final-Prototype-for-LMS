import React, { useState } from 'react';
import axios from 'axios';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

const OTPVerification = ({ userId, onVerificationSuccess }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { userId, otp });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAdmin', response.data.user.isAdmin);
        onVerificationSuccess();
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify Your Account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to your email to verify your account.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="otp" className="sr-only">OTP</label>
              <input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>
          {error && (
            <div className="flex items-center justify-center text-red-500 text-sm">
              <ExclamationCircleIcon className="h-5 w-5 mr-1" aria-hidden="true" />
              {error}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
