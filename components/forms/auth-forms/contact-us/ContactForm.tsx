'use client';

import React, { useState } from 'react';
import axiosInstance from '@/lib/axios/axiosInstance';
import ReCAPTCHA from "react-google-recaptcha";

const ContactUsForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Captcha handler
// Captcha handler
    const handleCaptcha = (token: string | null) => {
        if (token) {
        setCaptchaToken(token);
        } else {
        setCaptchaToken(''); // Reset captchaToken if no token
        }
    };
  

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!captchaToken) {
      setError('Please complete the reCAPTCHA.');
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/contact', {
        email,
        name,
        message,
        captchaToken,
      });

      if (res.status === 200) {
        setSuccessMessage(res.data.message);
        setEmail('');
        setName('');
        setMessage('');
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          className="form-input py-2 w-full"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          className="form-input py-2 w-full"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="message">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          className="form-input py-2 w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
        />
      </div>

      {/* Google reCAPTCHA */}
      <div className="mt-4">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} // Your reCAPTCHA site key
          onChange={handleCaptcha}
        />
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group flex justify-center items-center"
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
