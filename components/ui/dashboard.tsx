'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [user, setUser] = useState({
    email: '',
    stripeCustomerId: '',
    apiKey: '',
    tier: '',
    requestCount: 0,
    requestLimit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Get the stored token from localStorage (or wherever it's stored)
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found, please login.');
        return;
      }

      // Make an authenticated request to the profile endpoint
      const res = await axiosInstance.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setUser(res.data); // Set user data from the response
      } else {
        setError('Failed to load user data.');
      }
    } catch (err) {
      setError('An error occurred while fetching user profile.');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Fetch the profile when the component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold mb-4">User Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <div className="form-input py-2 w-full">{user.email}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stripe Customer ID:</label>
          <div className="form-input py-2 w-full">{user.stripeCustomerId}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key:</label>
          <div className="form-input py-2 w-full">{user.apiKey}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subscription Tier:</label>
          <div className="form-input py-2 w-full">{user.tier}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Request Count:</label>
          <div className="form-input py-2 w-full">{user.requestCount}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Request Limit:</label>
          <div className="form-input py-2 w-full">{user.requestLimit}</div>
        </div>
      </div>

      <div className="mt-6">
        <button
          className="btn-sm text-sm text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/some-other-page')}
        >
          Go to another page
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
