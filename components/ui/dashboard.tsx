'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useRouter } from 'next/navigation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
  const [user, setUser] = useState({
    email: '',
    stripeCustomerId: '',
    apiKey: '',
    tier: '',
    requestCount: 0,
    requestLimit: 0,
    referralCode: '', // Adding referralCode to the user state
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        router.push('/signin');
        return;
      }

      // Fetch the profile
      const res = await axiosInstance.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        const userData = res.data;
        // Set user data and generate referral code based on the email
        setUser({
          ...userData,
        });
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

  // Function to create Stripe portal session
  const handleCreatePortalSession = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        return;
      }

      // Make a request to create the Stripe customer portal session
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
    } catch (err) {
      setError('An error occurred while creating the portal session.');
      console.error('Portal session error:', err);
    }
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
      </div>

      {/* Circular Progress Bar for Request Usage */}
      <div className="w-40 mx-auto">
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
          className="btn-sm text-sm text-white bg-blue-600 hover:bg-blue-700"
          onClick={handleCreatePortalSession}
        >
          Manage Subscription
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
