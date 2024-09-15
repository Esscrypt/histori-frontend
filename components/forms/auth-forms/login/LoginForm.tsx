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
  const router = useRouter();
  const [canSignIn, setCanSignIn] = useState(false);

  const debouncedEmail = useDebounce(email, 500);
  const debouncedPassword = useDebounce(password, 500);

  // Validation function for email
  const validateEmail = (email: string) => {
    if (!EMAIL_VALIDATION.test(email) && email.length > 0) {
      return "Invalid email format";
    }
    return "";
  };

  // Validation function for password
  const validatePassword = (password: string) => {
   if (password.length < 6 && password.length > 0) {
      return "Password must be at least 6 characters";
    }
    return "";
  };




  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setEmail(value);

  }


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
    
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(process.env.NEXT_PUBLIC_API_URL);
    setLoading(true);
    
    try {
      const res = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      const data = res.data;

      if (res.status === 200) {
        // Store token in localStorage (or httpOnly cookie)
        document.cookie = `token=${data.token}; path=/; HttpOnly`;
        localStorage.setItem('token', data.token);

        // Redirect to dashboard or another page
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Validate email when debounced email changes
    const emailValidationError = validateEmail(debouncedEmail);
    setEmailError(emailValidationError);
  }, [debouncedEmail]);

  useEffect(() => {
    // Validate password when debounced password changes
    const passwordValidationError = validatePassword(debouncedPassword);
    setPasswordError(passwordValidationError);
  }, [debouncedPassword]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email <span className="text-rose-500">*</span></label>
          <input onChange={handleEmailChange} id="email" className="form-input py-2 w-full" type="email" value={email} required />
          {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password <span className="text-rose-500">*</span></label>
          <input id="password" className="form-input py-2 w-full" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} />
          {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-6">
        <button className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group" disabled={canSignIn}>
          Sign In
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
