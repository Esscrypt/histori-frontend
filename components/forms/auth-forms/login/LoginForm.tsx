'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios/axiosInstance';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email <span className="text-rose-500">*</span></label>
          <input id="email" className="form-input py-2 w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password <span className="text-rose-500">*</span></label>
          <input id="password" className="form-input py-2 w-full" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} />
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-6">
        <button className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group">
          Sign In <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
