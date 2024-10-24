'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useDebounce } from '@/lib/utils/useDebounce';
import { EMAIL_VALIDATION } from '@/config';
import { ethers } from 'ethers';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [oauthError, setOauthError] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isWeb3Loading, setIsWeb3Loading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams(); // Get query parameters
  const debouncedEmail = useDebounce(email, 500);
  const debouncedPassword = useDebounce(password, 500);

  const validateEmail = (email: string) => {
    if (!EMAIL_VALIDATION.test(email) && email.length > 0) {
      return 'Invalid email format';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (password.length < 6 && password.length > 0) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isChecked) {
      setError('Please agree to the Terms and Conditions');
      return;
    }
    setLoading(true);

    try {
      const referrer = localStorage.getItem('referrer'); // Get referrer from local storage if exists

      const res = await axiosInstance.post('/auth/login', {
        email,
        password,
        referrer, // Include referrer in the request
      });

      const data = res.data;
      if (res.status === 200) {
        document.cookie = `token=${data.accessToken}; path=/; HttpOnly`;
        localStorage.setItem('token', data.accessToken);
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || 'Invalid credentials');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleWeb3Login = async () => {
    if (!isChecked) {
      setError('Please agree to the Terms and Conditions');
      return;
    }

    try {
      setIsWeb3Loading(true);
      if (!window.ethereum) {
        setError('Please install MetaMask or another Web3 wallet');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const message = `Sign this message to log in: ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      const referrer = localStorage.getItem('referrer'); // Get referrer from local storage if exists

      const res = await axiosInstance.post('/auth/web3-login', {
        walletAddress: address,
        message,
        signature,
        referrer, // Send the referrer in the request if available
      });

      const data = res.data;
      if (res.status === 200) {
        localStorage.setItem('token', data.accessToken);
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError('Web3 login failed. Please try again.');
      console.error('Web3 login error:', err);
    } finally {
      setIsWeb3Loading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    if (!isChecked) {
      setError('Please agree to the Terms and Conditions');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/auth/${provider}-url`);
      const { url } = res.data;

      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || 'OAuth login failed. Please try again.');
      } else {
        setError('OAuth login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email to resend confirmation.');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/resend-confirmation', { email });
      setConfirmationMessage(res.data.message || 'Confirmation email has been resent.');
    } catch (err) {
      setError('Failed to resend confirmation email.');
      console.error('Error resending confirmation email:', err);
    }
  };

  // Handle storing referrer in local storage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referrerFromUrl = urlParams.get('referrer');

    if (referrerFromUrl) {
      localStorage.setItem('referrer', referrerFromUrl); // Store referrer in local storage
    }

    // OAuth2 flow: check for the code and exchange it for an access token
    const code = urlParams.get('code');
    const provider = urlParams.get('provider');

    if (code && provider) {
      exchangeOAuthCode(provider, code);
    }
  }, []);

  // OAuth2 flow: Exchange code for access token
  const exchangeOAuthCode = async (provider: string, code: string) => {
    try {
      const referrer = localStorage.getItem('referrer'); // Get referrer from local storage if exists

      const res = await axiosInstance.post(`/auth/${provider}/callback`, { code, referrer });
      const { accessToken } = res.data;
      localStorage.setItem('token', accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setOauthError('Failed to exchange OAuth code. Please try again.');
      console.error('OAuth code exchange error:', err);
    }
  };

  useEffect(() => {
    setEmailError(validateEmail(debouncedEmail));
  }, [debouncedEmail]);

  useEffect(() => {
    setPasswordError(validatePassword(debouncedPassword));
  }, [debouncedPassword]);

  return (
    <form onSubmit={handleSubmit}>
      {/* Web3 Login Button */}
      <div className="mt-6">
        <button
          className="btn-sm w-full text-sm text-white bg-purple-600 hover:bg-purple-700 group"
          type="button"
          onClick={handleWeb3Login}
          disabled={isWeb3Loading}
        >
          {isWeb3Loading ? 'Connecting Wallet...' : 'Login with Web3'}
        </button>
      </div>

      {/* OAuth Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          className="btn-sm w-full text-sm text-white bg-red-600 hover:bg-red-700 group"
          type="button"
          onClick={() => handleOAuthLogin('google')}
        >
          Login with Google
        </button>

        <button
          className="btn-sm w-full text-sm text-white bg-gray-600 hover:bg-gray-700 group"
          type="button"
          onClick={() => handleOAuthLogin('github')}
        >
          Login with GitHub
        </button>
      </div>

      {/* Email and Password Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            onChange={handleEmailChange}
            id="email"
            className="form-input py-2 w-full"
            type="email"
            value={email}
            required
          />
          {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              className="form-input py-2 w-full"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
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
            I agree to the{' '}
            <a href="support/privacy-policy" className="text-blue-600 underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="support/terms-conditions" className="text-blue-600 underline">
              Terms and Conditions
            </a>.
          </label>
        </div>

        {/* Log In Button */}
        <div className="mt-6">
          <button
            disabled={loading}
            type="submit"
            className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Logging In...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {confirmationMessage && <p className="text-green-500 mt-2">{confirmationMessage}</p>}

      {/* Sign Up Link */}
      <div className="mt-4 text-center">
        <p>
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 underline">
            Sign up here
          </a>
        </p>
      </div>

      {/* Resend Confirmation Link */}
      <div className="mt-4 text-center">
        <p>
          Didn't receive confirmation?{' '}
          <button
            onClick={handleResendConfirmation}
            className="text-blue-600 underline"
          >
            Resend confirmation email
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
