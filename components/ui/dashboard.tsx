'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useRouter } from 'next/navigation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
  const [user, setUser] = useState({
    email: '',
    apiKey: '',
    tier: '',
    requestCount: 0,
    requestLimit: 0,
    referralCode: '',
    referralPoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const router = useRouter();

  // Fetch user profile
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        router.push('/signin');
        return;
      }

      const res = await axiosInstance.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setUser(res.data);
      } else {
        setError('Failed to load user data.');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while fetching user profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Create Stripe portal session
  const handleCreatePortalSession = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        return;
      }

      const res = await axiosInstance.post(
        '/payments/create-portal-session',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201 && res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe portal
      } else {
        setError('Failed to create portal session.');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while creating the portal session.');
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Calculate percentage for the circular progress bar
  const usagePercentage = (user.requestCount / user.requestLimit) * 100;

  return (
    <div className="space-y-6 p-6 bg-white rounded shadow-md max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">User Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <div className="form-input py-2 w-full">{user.email}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Referral Points:</label>
          <div className="form-input py-2 w-full">{user.referralPoints}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key:</label>
          <div className="relative">
            <div className="form-input py-2 w-full">
              {apiKeyVisible ? user.apiKey : '••••••••••••••••'}
            </div>
            <button
              className="absolute right-3 top-3 text-sm text-blue-600 hover:underline"
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
            >
              {apiKeyVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subscription Tier:</label>
          <div className="form-input py-2 w-full">{user.tier}</div>
        </div>
      </div>

      {/* Circular Progress Bar for Request Usage */}
      <div className="w-40 mx-auto my-6">
        <CircularProgressbar
          value={usagePercentage}
          text={`${user.requestCount}/${user.requestLimit}`}
          styles={buildStyles({
            textSize: '16px',
            pathColor: usagePercentage > 80 ? 'red' : 'green',
            textColor: '#000',
          })}
        />
        <div className="text-center mt-2">Request Usage</div>
      </div>

      {/* Referral System */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Referral Program</h2>
        <p>Share your referral code and earn rewards:</p>
        <div className="form-input py-2 w-full">{user.referralCode}</div>
        <button
          className="btn-sm text-sm text-white bg-blue-600 hover:bg-blue-700 mt-2"
          onClick={() =>
            navigator.clipboard.writeText(
              `${window.location.origin}/signup?referrer=${user.referralCode}`
            )
          }
        >
          Copy Referral Link
        </button>
      </div>

      {/* Stripe Customer Portal */}
      <div className="mt-6">
        <button
          className="btn-sm text-sm text-white bg-blue-600 hover:bg-blue-700 w-full"
          onClick={handleCreatePortalSession}
        >
          Manage Subscription
        </button>
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          className="btn-sm text-sm text-white bg-red-600 hover:bg-red-700 w-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
