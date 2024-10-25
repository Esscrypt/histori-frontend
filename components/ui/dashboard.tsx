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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [apiKeyCopySuccess, setApiKeyCopySuccess] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [emailToUpdate, setEmailToUpdate] = useState('');
  const [emailError, setEmailError] = useState('');
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
            prevUser.referralPoints !== newUser.referralPoints;
  
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
      () => setApiKeyCopySuccess('API key copied!'),
      () => setApiKeyCopySuccess('Failed to copy API key')
    );
  };

  // Handle email input change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;
      setEmailToUpdate(email);
      setEmailError(EMAIL_VALIDATION.test(email) ? '' : 'Invalid email format');
    };

  // Update email
  const handleUpdateEmail = async () => {
    if (emailError) {
      setEmailError('Please enter a valid email before updating.');
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
    <div className="space-y-8 p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">User Dashboard</h1>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Email Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Email:</label>
          <div className="flex">
            <input
              type="email"
              className="form-input py-2 w-full border border-gray-300 rounded-md"
              value={emailToUpdate || user.email}
              onChange={handleEmailChange}
              disabled={!!user.email}  // Disable input if email exists
            />
            {!user.email && (
              <button
                className="ml-3 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={handleUpdateEmail}
                disabled={emailToUpdate.length === 0}
              >
                Set
              </button>
            )}
          </div>
          {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
          {emailSuccess && <p className="text-green-500 mt-2">{emailSuccess}</p>}
        </div>
  
        {/* Referral Points Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Referral Points:</label>
          <div className="py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-800">{user.referralPoints}</div>
        </div>
  
        {/* API Key Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-semibold mb-2 text-gray-700">API Key:</label>
          <div className="py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-800 truncate">
            {apiKeyVisible ? user.apiKeyValue : '••••••••••••••••'}
          </div>
          <div className="flex space-x-3 mt-2">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
            >
              {apiKeyVisible ? 'Hide' : 'Show'}
            </button>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={handleCopyApiKey}
            >
              Copy
            </button>
          </div>
          {apiKeyCopySuccess && <p className="text-green-500 mt-2">{apiKeyCopySuccess}</p>}
        </div>
  
        {/* Subscription Tier Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Subscription Tier:</label>
          <div className="py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-800">{user.tier}</div>
        </div>
      </div>
  
      {/* Conditionally display usage only if the tier is not 'None' */}
      {user.tier !== 'None' && (
        <div className="w-40 mx-auto my-8">
          <CircularProgressbar
            value={usagePercentage}
            text={`${user.requestCount}/${user.requestLimit}`}
            styles={buildStyles({
              textSize: '18px',
              pathColor: usagePercentage > 80 ? 'red' : 'green',
              textColor: '#333',
            })}
          />
          <div className="text-center mt-4 font-medium text-gray-600">Request Usage</div>
        </div>
      )}
  
    {/* Conditionally display subscription button */}
    <div className="mt-8">
      {['Free', 'None'].includes(user.tier) ? (
        <button
          className="btn-lg text-lg font-bold text-white bg-green-600 hover:bg-green-700 w-full py-3 rounded-lg shadow-lg"
          onClick={async () => {
            const token = localStorage.getItem('token');
            if (!token) {
              setError('No token found, please login.');
              router.push('/signin');
              return;
            }

            try {
              const res = await axiosInstance.post(
                '/payments/create-checkout-session',
                { lookup_key: 'starter' },  // Assuming 'starter_plan' is the lookup key for Starter plan
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (res.status === 201 && res.data.url) {
                window.location.href = res.data.url; // Redirect to Stripe checkout session
              } else {
                setError('Failed to create checkout session.');
              }
            } catch (err: any) {
              if (err.response && err.response.status === 400) {
                setError(err.response.data.message);
              } else {
                setError('An error occurred while creating the checkout session.');
              }
            }
          }}
        >
          Subscribe to Starter Plan
        </button>
      ) : (
        <button
          className="btn-lg text-lg font-bold text-white bg-green-600 hover:bg-green-700 w-full py-3 rounded-lg shadow-lg"
          onClick={handleCreatePortalSession}
        >
          Manage Subscription
        </button>
      )}
    </div>

  
      {/* Referral System */}
      <div className="mt-10 bg-blue-50 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-2 text-blue-800">Referral Program</h2>
        <p className="mb-4 text-sm text-blue-600">Share your referral code and earn rewards:</p>
        <div className="form-input py-2 text-center bg-white border border-blue-200 rounded-lg text-gray-700">{user.referralCode}</div>
        <button
          className="btn-sm text-sm text-white bg-blue-600 hover:bg-blue-700 mt-4 w-full py-2 rounded-md"
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/signin?referrer=${user.referralCode}`
            );
            setCopySuccess('Referral link copied successfully!');
            setTimeout(() => setCopySuccess(''), 3000); // Hide success message after 3 seconds
          }}
        >
          Copy Referral Link
        </button>
        {copySuccess && <p className="text-green-500 mt-2 text-center">{copySuccess}</p>}
      </div>
  
      {/* Conditionally display Telegram link if tier is above 'Starter' */}
      {['Starter', 'Growth', 'Business'].includes(user.tier) && (
        <div className="mt-6">
          <button
            className="btn-m text-sm text-white bg-blue-600 hover:bg-blue-700 w-full text-center py-2 rounded-md"
            onClick={() => window.open('https://t.me/+Khm3XK761_Y1NWI8')}
          >
            Join our Telegram
          </button>
        </div>
      )}
  
      {/* Account Management Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <button
          className="btn-m text-m font-bold text-white bg-red-600 hover:bg-red-700 w-full py-2 rounded-md"
          onClick={handleLogout}
        >
          Logout
        </button>
  
        <button
          className="btn-m text-m font-bold text-white bg-red-600 hover:bg-red-700 w-full py-2 rounded-md"
          onClick={handleDeleteUser}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
  
  
};

export default Dashboard;
