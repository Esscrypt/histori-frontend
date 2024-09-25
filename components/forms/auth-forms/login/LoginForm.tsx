'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useDebounce } from '@/lib/utils/useDebounce';
import { EMAIL_VALIDATION } from '@/config';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // Checkbox state for T&C
  const [oauthError, setOauthError] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const router = useRouter();

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
    setIsChecked(!isChecked); // Toggle checkbox state
    setError(''); // Clear any error message
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isChecked) {
      setError('Please agree to the Terms and Conditions');
      return;
    }
    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const data = res.data;

      if (res.status === 200) {
        document.cookie = `token=${data.token}; path=/; HttpOnly`;
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
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
    } catch (error) {
      setError('OAuth login failed. Please try again.');
      console.error('OAuth login error:', error);
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

  const exchangeOAuthCode = async (provider: string, code: string, referrer?: string) => {
    try {
      const res = await axiosInstance.post(`/auth/${provider}/callback`, { code, referrer });
      const { accessToken } = res.data;
      localStorage.setItem('token', accessToken);
      router.push('/dashboard');
    } catch (error) {
      setOauthError('Failed to exchange OAuth code.');
      console.error('OAuth code exchange error:', error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const provider = urlParams.get('provider');
    const referrer = urlParams.get('referrer') || undefined;

    if (code) {
      exchangeOAuthCode(provider!, code, referrer);
    }
  }, []);

  useEffect(() => {
    setEmailError(validateEmail(debouncedEmail));
  }, [debouncedEmail]);

  useEffect(() => {
    setPasswordError(validatePassword(debouncedPassword));
  }, [debouncedPassword]);

  return (
    <form onSubmit={handleSubmit}>
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
          <input
            id="password"
            className="form-input py-2 w-full"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            minLength={6}
          />
          {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
        </div>
        {/* Reset Password and Resend Email Confirmation Links */}
        <div className="flex justify-between">
          <a href="/reset-password" className="text-blue-600 underline">
            Forgot your password?
          </a>
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={handleResendConfirmation}
          >
            Resend confirmation email
          </button>
        </div>
        {confirmationMessage && <p className="text-green-500 mt-2">{confirmationMessage}</p>}
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

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
          </a>
          .
        </label>
      </div>

      {/* Sign In Button */}
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
            <>
              Log In
              <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                -&gt;
              </span>
            </>
          )}
        </button>
      </div>

      {oauthError && <p className="text-red-500 mt-4">{oauthError}</p>}

      {/* Sign Up Link */}
      <div className="mt-4 text-center">
        <p>
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 underline">
            Sign up here
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
