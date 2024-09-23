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
  const router = useRouter();

  const debouncedEmail = useDebounce(email, 500);
  const debouncedPassword = useDebounce(password, 500);

  // Validation function for email
  const validateEmail = (email: string) => {
    if (!EMAIL_VALIDATION.test(email) && email.length > 0) {
      return 'Invalid email format';
    }
    return '';
  };

  // Validation function for password
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const data = res.data;

      if (res.status === 200) {
        document.cookie = `token=${data.token}; path=/; HttpOnly`;
        localStorage.setItem('token', data.token);
        router.push('/');
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
    setLoading(true);
    try {
      // Start the OAuth flow by asking the backend for the authorization URL
      const res = await axiosInstance.get(`/auth/${provider}-url`);
      const { url } = res.data;

      // Once you get the authorization URL, navigate to it
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

  const exchangeOAuthCode = async (provider: string, code: string) => {
    try {
      const res = await axiosInstance.post(`/auth/${provider}/callback`, { code });
      const { access_token } = res.data;
      // Store the access token and navigate to the dashboard
      localStorage.setItem('token', access_token);
      router.push('/');
    } catch (error) {
      setOauthError('Failed to exchange OAuth code.');
      console.error('OAuth code exchange error:', error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const provider = urlParams.get('provider');
    // const provider = window.location.pathname.includes('google') ? 'google' : 'github';

    if (code) {
      exchangeOAuthCode(provider!, code);
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
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email <span className="text-rose-500">*</span>
          </label>
          <input onChange={handleEmailChange} id="email" className="form-input py-2 w-full" type="email" value={email} required />
          {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password <span className="text-rose-500">*</span>
          </label>
          <input id="password" className="form-input py-2 w-full" type="password" value={password} onChange={handlePasswordChange} required minLength={6} />
          {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
        </div>
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
          I agree to the <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a> and <a href="/terms" className="text-blue-600 underline">Terms and Conditions</a>.
        </label>
      </div>

      {/* Sign In Button */}
      <div className="mt-6">
        <button
          className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group"
          type="submit"
          disabled={!isChecked || loading} // Disable if not checked or loading
        >
          {loading ? 'Signing In...' : 'Sign In'}
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

      {oauthError && <p className="text-red-500 mt-4">{oauthError}</p>}
      {/* Sign Up Link */}
      <div className="mt-4 text-center">
        <p>
          Don't have an account? <a href="/signup" className="text-blue-600 underline">Sign up here</a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
