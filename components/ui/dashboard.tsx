'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useRouter } from 'next/navigation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { EMAIL_VALIDATION } from '@/config';
import { FaTelegramPlane, FaEye, FaEyeSlash, FaCopy } from 'react-icons/fa';

import { ethers } from 'ethers';

import bn from 'bignumber.js'; // Importing bignumber.js for precision control


const Dashboard = () => {
  const [user, setUser] = useState({
    email: '',
    apiKeyValue: '',
    projectId: '',
    tier: '',
    rpcTier: '',
    planEndDate: '',
    rpcPlanEndDate: '',
    requestCount: 0,
    requestLimit: 0,
    rpcRequestCount: 0,
    rpcRequestLimit: 0,
    referralCode: '',
    referralPoints: 0,
    web3Address: '',
    hstBalance: '',
    hstToUSD: '',
    totalBalanceInUSD: '',
  });


  const [confirmations, setConfirmations] = useState(0);
  const [depositLoading, setDepositLoading] = useState(false);
  const targetConfirmations = 50;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [projectIdVisible, setProjectIdVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [apiKeyCopySuccess, setApiKeyCopySuccess] = useState('');
  const [projectIdCopySuccess, setProjectIdCopySuccess] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [emailToUpdate, setEmailToUpdate] = useState('');
  const [emailError, setEmailError] = useState('');

  const [activeTab, setActiveTab] = useState('userdetails');

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
        setUser(newUser);

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

  function getTimestampInSeconds() {
    // returns current timestamp in seconds
    return Math.floor(Date.now() / 1000);
  }

  const hasEnoughBalance = (tier: string): Boolean => {
    const tierAmount = tier === 'starter' ? 50 : tier === 'growth' ? 200 : 400;

    const tierAmountBn = new bn(tierAmount);
    const balanceInUSDBn = new bn(user.totalBalanceInUSD);

    // Early exit if user balance in USD is less than tier amount
    return balanceInUSDBn.gt(tierAmountBn) ? true : false;
  }
  // Handle deposit with permit
  const handleDeposit = async (tier: string, isForApi: boolean): Promise<ethers.TransactionResponse | undefined> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        router.push('/signin');
        return undefined;
      }

      const tierAmount = tier === 'starter' ? 50 : tier === 'growth' ? 200 : 400;

      const tierAmountBn = new bn(tierAmount);
      const balanceInUSDBn = new bn(user.totalBalanceInUSD);
      const hstToUSDBn = new bn(user.hstToUSD);

      // Early exit if user balance in USD is less than tier amount
      if(balanceInUSDBn.lt(tierAmountBn)) {
        setError("Insufficient balance for the selected tier.");
        return;
      }

      const hstAmount = ethers.parseEther(tierAmountBn.dividedBy(hstToUSDBn).toFixed(0));
      console.log('Tier amount in HST:', hstAmount);
      
      const web3Address = user.web3Address;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenContractAbi: string[] = [
        'function name() view returns (string)',
        'function nonces(address) view returns (uint256)',
      ]

     const hstTokenContract = new ethers.Contract(process.env.HST_TOKEN_ADDRESS!, tokenContractAbi, signer);

     console.log('User address:', web3Address);
      // Get nonce for permit
      const nonce = await hstTokenContract.nonces(web3Address);
      console.log(nonce);

      const deadline = getTimestampInSeconds() + 4200;

      // Create a domain for EIP-712 signature
      const domain = {
        name: await hstTokenContract.name(),
        version: '1',
        chainId: (await provider.getNetwork()).chainId,
        verifyingContract: process.env.HST_TOKEN_ADDRESS!,
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      //TODO - calculate tier ammount in HST wei

      const values = {
        owner: web3Address,
        spender: process.env.DEPOSIT_ADDRESS!, // Replace with your deposit contract address
        value: hstAmount,
        nonce: nonce,
        deadline: deadline, // 1 hour from now
      };

      console.log(values);

      // Sign the permit
      const signatureBytes = await signer.signTypedData(domain, types, values);

      const splitSig = ethers.Signature.from(signatureBytes);

          // verify the Permit type data with the signature
      const recovered = ethers.verifyTypedData(
        domain,
        types,
        values,
        splitSig
      );

      console.log('Recovered address:', recovered);
    
      // get network gas price
      // const gasPrice = (await provider.getFeeData()).gasPrice;
      // console.log('Gas price:', gasPrice!.toString());

      const depositContractABI: string[] = [
        'function depositForAPI(uint256,uint8,uint256,uint8,bytes32,bytes32)',
        'function depositForRPC(uint256,uint8,uint256,uint8,bytes32,bytes32)'
      ];

      const tierNumber = tier === 'starter' ? 0 : tier === 'growth' ? 1 : 2;
      // Now call the deposit function with the permit
      const depositContract = new ethers.Contract(process.env.DEPOSIT_ADDRESS!, depositContractABI, signer); // Ensure you have the Deposit contract ABI
      let tx;
      if(isForApi) {
        tx = await depositContract.depositForAPI(
          hstAmount,
          tierNumber, // Pass the tier directly if required
          deadline,
          splitSig.v,
          splitSig.r,
          splitSig.s,
        );
      } else {
        tx = await depositContract.depositForRPC(
          hstAmount,
          tierNumber, // Pass the tier directly if required
          deadline,
          splitSig.v,
          splitSig.r,
          splitSig.s,
        );
      }

      return tx;
    } catch (err) {
      console.error(err);
      setError('An error occurred while processing your deposit.');
    }
  };

  const handleDepositWithLoading = async (tier: string, isForApi: boolean) => {
    setDepositLoading(true);
    setConfirmations(0);
    try {
      const tx: ethers.TransactionResponse | undefined = await handleDeposit(tier, isForApi);
      if (!tx) {
        setDepositLoading(false);
        return;
      }

      // Track confirmations until reaching the target number
      tx.wait().then((receipt: any) => {
        
        if(process.env.ENV !== undefined && process.env.ENV ==='development' && receipt && receipt.status === 1) {
          setDepositLoading(false);
        } else {
          // Listen for each confirmation
          tx.wait(targetConfirmations).then(() => {
            setDepositLoading(false);
            // alert("Deposit successful with 50 confirmations!");
          });
        }
        
      });

    } catch (error) {
      console.error("Deposit failed:", error);
      setDepositLoading(false);
    }
  };

  // Copy API key to clipboard
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(user.apiKeyValue).then(
      () => setApiKeyCopySuccess('API key copied!'),
      () => setApiKeyCopySuccess('Failed to copy API key')
    );
  };

  const handleCopyProjectId = () => {
    navigator.clipboard.writeText(user.projectId).then(
      () => setProjectIdCopySuccess('Project ID copied!'),
      () => setProjectIdCopySuccess('Failed to copy Project ID')
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

  const handleCreateCheckoutSession = async (suffix?: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please login.');
      router.push('/signin');
      return;
    }

    try {
      const res = await axiosInstance.post(
        '/payments/create-checkout-session',
        { lookup_key: `starter${suffix}` },  // Assuming 'starter_plan' is the lookup key for Starter plan
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
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/signin?referrer=${user.referralCode}`
    );
    setCopySuccess('Referral link copied successfully!');
    setTimeout(() => setCopySuccess(''), 3000); // Hide success message after 3 seconds
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
  const rpcUsagePercentage = (user.rpcRequestCount / user.rpcRequestLimit) * 100;
  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg max-w-3xl mx-auto mt-12">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">User Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex justify-around mb-8 border-b-2 border-gray-300">
        {['User Details', 'API Service', 'RPC Service'].map(tab => (
          <button
            key={tab}
            className={`px-6 py-3 font-semibold rounded-t-lg transition-all duration-300 ${activeTab === tab.toLowerCase().replace(' ', '') ? 'bg-blue-700 text-white shadow-md' : 'bg-blue-100 text-blue-700'}`}
            onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'userdetails' && (
        <div>
          {/* HST Balance Section */}
          {user.web3Address && (<div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg text-center mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Current HST Balance</h2>
            <h4 className="text-sm font-medium text-blue-600 mb-4 max-w-md mx-auto">
              Use HST Tokens to deposit, access the service, and earn staking rewards.
            </h4>
            
            <div className="flex justify-center items-baseline space-x-1">
              <span className="text-2xl font-bold text-blue-800">
                {user.hstBalance || 0} HST
              </span>
              <span className="text-sm font-semibold text-gray-600">
                {user.totalBalanceInUSD || 0} USD
              </span>
            </div>
          </div>)}
          {/* User Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md py-2 px-4"
                  value={emailToUpdate || user.email}
                  onChange={handleEmailChange}
                  disabled={!!user.email}
                  placeholder="Enter email"
                />
                {!user.email && (
                  <button
                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                    onClick={handleUpdateEmail}
                    disabled={emailToUpdate.length === 0}
                  >
                    Set
                  </button>
                )}
              </div>
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              {emailSuccess && <p className="text-green-500 text-sm mt-1">{emailSuccess}</p>}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <label className="block text-gray-700 font-medium mb-1">Referral Points</label>
              <p className="text-gray-800 py-2">{user.referralPoints}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <label className="block text-gray-700 font-medium mb-1">API Key</label>
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                <span className="text-gray-800 truncate">{apiKeyVisible ? user.apiKeyValue : '••••••••••••••••'}</span>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setApiKeyVisible(!apiKeyVisible)} className="text-blue-600">
                    {apiKeyVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button onClick={handleCopyApiKey} className="text-blue-600">
                    <FaCopy />
                  </button>
                </div>
              </div>
              {apiKeyCopySuccess && <p className="text-green-500 text-sm mt-1">{apiKeyCopySuccess}</p>}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <label className="block text-gray-700 font-medium mb-1">Project ID</label>
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                <span className="text-gray-800 truncate">{projectIdVisible ? user.projectId : '••••••••••••••••'}</span>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setProjectIdVisible(!projectIdVisible)} className="text-blue-600">
                    {projectIdVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button onClick={handleCopyProjectId} className="text-blue-600">
                    <FaCopy />
                  </button>
                </div>
              </div>
              {projectIdCopySuccess && <p className="text-green-500 text-sm mt-1">{projectIdCopySuccess}</p>}
            </div>
          </div>

          {/* Manage Subscription Button */}
          {(!(['None', 'Free'].includes(user.tier)) && !(['None', 'Free Archival MultiNode'].includes(user.rpcTier))) && (
          <div className="text-center">
            <button
              className="w-full py-3 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-all"
              onClick={handleCreatePortalSession}
            >
              Manage Subscriptions
            </button>
          </div>)}

          {/* Referral Program */}
          <div className="mt-10 bg-blue-50 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-medium text-blue-800 mb-2">Referral Program</h2>
            <p className="text-gray-600 text-sm mb-4">Share your referral code and earn rewards</p>
            <div className="form-input py-2 px-4 bg-white border border-blue-200 rounded-md text-gray-700 mb-2">{user.referralCode}</div>
            <button
              className="mt-2 w-full py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all"
              onClick={handleCopyReferralLink}
            >
              Copy Referral Link
            </button>
            {copySuccess && <p className="text-green-500 text-sm mt-2">{copySuccess}</p>}
          </div>


            {/* Telegram Join */}
          {(!(['None', 'Free'].includes(user.tier)) && !(['None', 'Free Archival MultiNode'].includes(user.rpcTier))) && (
          <div className="mt-6">
            <button
              className="w-full py-3 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all flex items-center justify-center"
              onClick={() => window.open('https://t.me/+Khm3XK761_Y1NWI8')}
            >
              <FaTelegramPlane className="mr-2" /> Join our Telegram
            </button>
          </div>)}

          {/* Account Management */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              className="py-3 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-all"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="py-3 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-all"
              onClick={handleDeleteUser}
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {activeTab === 'apiservice' && (
        <div>
          {/* Current Tier Display */}
          <div className="flex flex-col items-center bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-blue-800">Current REST API & SDK Tier</h3>
            <span className="text-2xl font-bold text-gray-800 mt-2">{user.tier || "No Active Tier"}</span>
            {user.planEndDate && (<span className="text-2xl font-bold text-gray-800 mt-2">Web3 subscription ends on: {new Date(user.planEndDate).toLocaleDateString()}</span>)}
          </div>
          {/* API Usage Progress */}
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Histori Rest API & SDK Usage</h3>
            <div className="w-32 mb-4">
              <CircularProgressbar
                value={usagePercentage}
                text={`${user.requestCount}/${user.requestLimit}`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: usagePercentage > 80 ? 'red' : 'green',
                  textColor: '#333',
                })}
              />
            </div>
          </div>
          {/* API Service Content */}
          {user.web3Address && (
            <h2 className="text-lg font-medium text-center text-blue-700 mb-4">Subscribe to REST API & SDK Plans</h2>
          )}
          
          {/* Subscription Buttons with Loading Spinner */}
          {user.web3Address && (
            <div className="mt-8 text-center space-y-4">
              {depositLoading ? (
                <div className="flex flex-col items-center">
                  <LargeSpinner />
                  <p className="mt-4 text-lg font-semibold text-gray-700">
                    Deposit in progress... {targetConfirmations} confirmations required.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Your tier will update after 50 confirmation blocks.
                  </p>
                </div>
              ) : (
                <>
                  {hasEnoughBalance('starter')  && ['None', 'Free'].includes(user.tier) && (
                    <button
                      onClick={() => handleDepositWithLoading('starter', true)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                    >
                      API Starter Plan Web3 Deposit
                    </button>
                  )}
                  {hasEnoughBalance('growth') && user.tier === 'Starter' && (
                    <button
                      onClick={() => handleDepositWithLoading('growth', true)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                    >
                      API Growth Plan Web3 Deposit
                    </button>
                  )}
                  {hasEnoughBalance('business')  && user.tier === 'Growth' && (
                    <button
                      onClick={() => handleDepositWithLoading('business', true)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                    >
                      API Business Plan Web3 Deposit
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Starter Plan Subscription Button with Stripe */}
          {["None", "Free"].includes(user.tier) && (
            <div className="mt-8 text-center">
              <button
                className="w-full py-4 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-all"
                onClick={() => handleCreateCheckoutSession('')}
              >
                Subscribe to Starter Plan With Stripe
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rpcservice' && (
        <div>
          {/* Current Tier Display */}
          <div className="flex flex-col items-center bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-blue-800">Current RPC Tier</h3>
            <span className="text-2xl font-bold text-gray-800 mt-2">{user.rpcTier || "No Active Tier"}</span>
            {user.rpcPlanEndDate && (<span className="text-2xl font-bold text-gray-800 mt-2">Web3 subscription ends on: {new Date(user.rpcPlanEndDate).toLocaleDateString()}</span>)}
          </div>
          {/* RPC Usage Progress */}
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Histori RPC Historical MultiNode Usage</h3>
            <div className="w-32 mb-4">
              <CircularProgressbar
                value={rpcUsagePercentage}
                text={`${user.rpcRequestCount}/${user.rpcRequestLimit}`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: rpcUsagePercentage > 80 ? 'red' : 'green',
                  textColor: '#333',
                })}
              />
            </div>
          </div>
          {/* API Service Content */}
          {user.web3Address && (
            <h2 className="text-lg font-medium text-center text-blue-700 mb-4">Subscribe to RPC Archival MultiNode Plans</h2>
          )}
          
          {/* Subscription Buttons */}
          {user.web3Address && (
            <div className="mt-8 text-center space-y-4">
              {hasEnoughBalance('starter') && ['None', 'Free Archival MultiNode'].includes(user.rpcTier) && (
                <button
                  onClick={() => handleDeposit('starter', false)}
                  className="w-full bg-blue-600 text-lg font-semibold text-white py-4 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                  RPC Archival MultiNode Starter Plan Web3 Deposit
                </button>
              )}
              {hasEnoughBalance('growth') && user.rpcTier === 'Starter Archival MultiNode' && (
                <button
                  onClick={() => handleDeposit('growth', false)}
                  className="w-full bg-blue-600 text-lg font-semibold text-white py-4 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                  RPC Growth Archival MultiNode Plan Web3 Deposit
                </button>
              )}
              {hasEnoughBalance('business') && user.rpcTier === 'Growth Archival MultiNode' && (
                <button
                  onClick={() => handleDeposit('business', false)}
                  className="w-full bg-blue-600 text-lg font-semibold text-white py-4 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                  RPC Business Archival MultiNode Plan Web3 Deposit
                </button>
              )}
            </div>
          )}

          {/* Starter Plan Subscription Button with Stripe */}
          {["None", "Free Archival MultiNode"].includes(user.rpcTier) && (
            <div className="mt-8 text-center">
              <button
                className="w-full py-4 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-all"
                onClick={() => handleCreateCheckoutSession('-multinode')}
              >
                Subscribe to Starter Archival MultiNode Plan With Stripe
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

const LargeSpinner = () => (
  <svg
    className="animate-spin h-12 w-12 text-blue-600"
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
);

export default Dashboard;
