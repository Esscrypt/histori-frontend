'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useRouter } from 'next/navigation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { EMAIL_VALIDATION } from '@/config';

const Dashboard = () => {
  const [user, setUser] = useState({
    email: '',
    apiKeyValue: '',
    tier: '',
    requestCount: 0,
    requestLimit: 0,
    referralCode: '',
    referralPoints: 0,
    firstName: '',     // Add firstName to user state
    lastName: '',      // Add lastName to user state
    username: '',      // Add username to user state
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [emailToUpdate, setEmailToUpdate] = useState('');
  const [emailError, setEmailError] = useState('');
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const router = useRouter();

  // List of subscription tiers in ascending order
  const subscriptionTiers = ['Free', 'Starter', 'Growth', 'Business', 'Enterprise'];
  const lookupKeys = {
    Starter: 'starter',
    Growth: 'growth',
    Business: 'business',
    Enterprise: 'enterprise',
  };

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
        const newUser = res.data;
        console.log(newUser);
        setUser((prevUser) => {
          // Check if there are changes in the user data
          const hasChanges = 
            prevUser.email !== newUser.email ||
            prevUser.apiKeyValue !== newUser.apiKeyValue ||
            prevUser.tier !== newUser.tier ||
            prevUser.requestCount !== newUser.requestCount ||
            prevUser.requestLimit !== newUser.requestLimit ||
            prevUser.referralCode !== newUser.referralCode ||
            prevUser.referralPoints !== newUser.referralPoints ||
            prevUser.firstName !== newUser.firstName ||
            prevUser.lastName !== newUser.lastName ||
            prevUser.username !== newUser.username;
  
            // Only return newUser if changes are detected, otherwise keep the old state
            return hasChanges ? newUser : prevUser;
        });

      } else {
        setError('Failed to load user data.');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setTimeout(() => {
          setError('An error occurred while fetching user profile.');
          localStorage.removeItem('token');
          router.push('/signin');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Copy API key to clipboard
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(user.apiKeyValue).then(
      () => setCopySuccess('API key copied!'),
      () => setCopySuccess('Failed to copy API key')
    );
  };

  // Handle email input change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;
      setEmailToUpdate(email);
      setEmailError(EMAIL_VALIDATION.test(email) ? '' : 'Invalid email format');
    };

  // Upgrade subscription to the next tier
  const handleUpgradeSubscription = async () => {
    const currentTierIndex = subscriptionTiers.indexOf(user.tier);

    if (currentTierIndex === subscriptionTiers.length - 1) {
      setUpgradeMessage('You are already on the highest subscription tier (Enterprise).');
      return;
    }

    const nextTier = subscriptionTiers[currentTierIndex + 1] as keyof typeof lookupKeys;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        return;
      }

      const res = await axiosInstance.post(
        '/payments/create-checkout-session',
        { lookup_key: lookupKeys[nextTier] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201 && res.data.url) {
        window.location.href = res.data.url; // Redirect to the Stripe checkout session
      } else {
        setError('Failed to upgrade subscription.');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while upgrading subscription.');
      }
    }
  };

  // Update email
  const handleUpdateEmail = async () => {
    if (emailError) {
      setError('Please enter a valid email before updating.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        return;
      }

      const res = await axiosInstance.post(
        '/auth/update-email',
        { email: emailToUpdate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        setEmailSuccess(res.data.message);
      } else {
        setError('Failed to update email.');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while updating email.');
      }
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

  // Handle user deletion
  const handleDeleteUser = async () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmation) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        return;
      }

      const res = await axiosInstance.delete('/auth/delete-user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        alert(res.data.message);
      } else {
        setError('Failed to delete user.');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while deleting the user.');
      }
    }
  };

    // Confirm user deletion
  const confirmDeletion = async (token: string) => {
    try {
      const res = await axiosInstance.post('/auth/confirm-delete', { token });

      if (res.status === 200) {
        setDeleteSuccess('Your account has been successfully deleted.');
        // Optionally, redirect to the homepage or login page after a short delay
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
      } else {
        setError('Failed to confirm account deletion.');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while confirming deletion.');
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  // Polling the user profile every 10 seconds to check for serverIp provisioning
  // useEffect(() => {
  //   const intervalId = setInterval(fetchUserProfile, 10000); // Poll every 10 seconds

  //   return () => clearInterval(intervalId); // Clear interval on unmount
  // }, []);


  useEffect(() => {
    fetchUserProfile();

    // Check for deletion token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('deletionToken') || undefined;

    if (token) {
      confirmDeletion(token);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (deleteSuccess) {
    return <div className="text-green-500">{deleteSuccess}</div>;
  }

  // Calculate percentage for the circular progress bar
  const usagePercentage = (user.requestCount / user.requestLimit) * 100;

  return (
    <div className="space-y-6 p-6 bg-white rounded shadow-md max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">User Dashboard</h1>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username:</label>
          <div className="form-input py-2 w-full">{user.username || 'N/A'}</div>
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium mb-1">First Name:</label>
          <div className="form-input py-2 w-full">{user.firstName || 'N/A'}</div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Last Name:</label>
          <div className="form-input py-2 w-full">{user.lastName || 'N/A'}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <div className="flex">
          <input
              type="email"
              className="form-input py-2 w-full"
              value={emailToUpdate || user.email}
              onChange={handleEmailChange}
            />
            <button
              className="ml-2 btn-sm text-sm text-white bg-blue-600 hover:bg-blue-700"
              onClick={handleUpdateEmail}
              disabled={!!emailError}
            >
              Update
            </button>
          </div>
          {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
          {emailSuccess && <p className="text-green-500 mt-1">{emailSuccess}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Referral Points:</label>
          <div className="form-input py-2 w-full">{user.referralPoints}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key:</label>
          <div className="form-input py-2 w-full truncate">{apiKeyVisible ? user.apiKeyValue : '••••••••••••••••'}</div>
          <div className="flex space-x-2 mt-1">
            <button
              className="btn-sm text-sm text-blue-600 hover:underline"
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
            >
              {apiKeyVisible ? 'Hide' : 'Show'}
            </button>
            <button
              className="btn-sm text-sm text-blue-600 hover:underline"
              onClick={handleCopyApiKey}
            >
              Copy
            </button>
          </div>
          {copySuccess && <p className="text-green-500 mt-1">{copySuccess}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subscription Tier:</label>
          <div className="form-input py-2 w-full">{user.tier}</div>
          <button
            className="mt-2 btn-sm text-sm text-white bg-blue-600 hover:bg-blue-700 w-full"
            onClick={handleUpgradeSubscription}
          >
            Upgrade Subscription
          </button>
          {upgradeMessage && <p className="text-green-500 mt-1">{upgradeMessage}</p>}
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

      {/* Delete User Button */}
      <div className="mt-6">
        <button
          className="btn-sm text-sm text-white bg-red-600 hover:bg-red-700 w-full"
          onClick={handleDeleteUser}
        >
          Delete Account
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
