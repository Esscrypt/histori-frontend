'use client'

import React, { useState } from 'react';
import axiosInstance from '@/lib/axios/axiosInstance'; // Adjust the path to your axios instance
import { useRouter } from 'next/navigation';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous error
    setSuccessMessage(''); // Clear previous success message

    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      if (res.status === 200) {
        setSuccessMessage('Password reset link has been sent to your email.');
        // Optionally redirect to a success page
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
      }
    } catch (err) {
      setError('Failed to send password reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            className="form-input py-2 w-full"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

      <div className="mt-6">
        <button
          type="submit"
          className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Reset Password'}
          <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
            -&gt;
          </span>
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
