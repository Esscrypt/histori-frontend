'use client'

import { EMAIL_VALIDATION } from '@/config';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [token, setToken] = useState(''); // Store the token if present
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false); // Checkbox state for T&C
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showRepeatPassword, setShowRepeatPassword] = useState(false); // State to toggle repeat password visibility
  const router = useRouter();

  // Handle email change and debounce validation
  const handleEmailChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setEmail(value);

    let timeoutId;
    timeoutId = setTimeout(() => {
      if (EMAIL_VALIDATION.test(email)) {
        setIsValidEmail(true);
        setError('');
      } else {
        setIsValidEmail(false);
        setError('Invalid email');
      }
    }, 500);

    clearTimeout(timeoutId);
  };

  const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setRepeatPassword(e.target.value);
  };

  const comparePasswords = () => {
    if (password !== repeatPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  };

  useEffect(() => {
    comparePasswords();
  }, [password, repeatPassword]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle checkbox state
    setError(''); // Clear any error message
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  // Extract token from query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!isChecked) {
      setError('Please agree to the Terms and Conditions');
      return;
    }

    setLoading(true);
    try {
      if (token) {
        const res = await axiosInstance.post('/auth/reset-password', {
          token,
          newPassword: password,
        });
        alert(res.data.message);
        router.push('/signin');
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const referrer = urlParams.get('referrer') || undefined;
        const res = await axiosInstance.post('/auth/register', {
          email,
          password,
          repeatPassword,
          referrer,
        });
        alert(res.data.message);
        router.push('/signin');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message); // Show specific error message
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {!token && (
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              className="form-input py-2 w-full"
              type="email"
              required
              onChange={handleEmailChange}
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              className="form-input py-2 w-full"
              type={showPassword ? 'text' : 'password'}
              autoComplete="on"
              required
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="repeat-password">
            Repeat Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="repeat-password"
              className="form-input py-2 w-full"
              type={showRepeatPassword ? 'text' : 'password'}
              autoComplete="off"
              required
              onChange={handleRepeatPasswordChange}
            />
            <button
              type="button"
              onClick={toggleRepeatPasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showRepeatPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        {error && <p className="text-sm font-bold text-rose-500">{error}</p>}
      </div>

      {/* Terms and Conditions */}
      <div className="mt-4">
        <input
          type="checkbox"
          id="agree"
          className="form-checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="agree" className="ml-2">
          I agree to the <a href="support/privacy-policy" className="text-blue-600 underline">Privacy Policy</a> and <a href="support/terms-conditions" className="text-blue-600 underline">Terms and Conditions</a>.
        </label>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          disabled={loading}
          type="submit"
          className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group flex justify-center items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {token ? 'Resetting Password...' : 'Signing Up...'}
            </>
          ) : (
            <>
              {token ? 'Reset Password' : 'Sign Up'}
              <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
            </>
          )}
        </button>
      </div>

      {/* "Already have an account? Log in" link */}
      <div className="mt-4 text-center">
        <p>
          Already have an account? <a href="/signin" className="text-blue-600 underline">Log in here</a>
        </p>
      </div>
    </form>
  );
};

export default Register;
