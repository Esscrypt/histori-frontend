'use client'


import { EMAIL_VALIDATION } from '@/config';
import axiosInstance from '@/lib/axios/axiosInstance'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const Register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false); // Checkbox state for T&C
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Declare the timeoutId variable
    let timeoutId: NodeJS.Timeout;
    // Debounce the entered value
    timeoutId = setTimeout(() => {
      // Perform validation logic here
      if (EMAIL_VALIDATION.test(email)) {

        setIsValidEmail(true);
        // Clear any previous error
        setError('');
      } else {
        setIsValidEmail(false);
        setError('Invalid email');
      }
    }, 500);
    
    clearTimeout(timeoutId);

    // Validate the debounced value

  };

  const submitEmailConfirmToken = async (token: string) => {
    try {
      const res = await axiosInstance.post(`/auth/confirm-email`, { token });
      alert(res.data.message);
      router.push('/signin');
    } catch (error) {
      setError('Failed to exchange OAuth code.');
      console.error('OAuth code exchange error:', error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      submitEmailConfirmToken(token);
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  }
  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRepeatPassword(value);
  }

  const comparePasswords = () => {
    if (password !== repeatPassword) {
      setError('Passwords do not match');
    }
  }

  useEffect(() => {
    comparePasswords();
  }
  , [password, repeatPassword]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle checkbox state
    setError(''); // Clear any error message
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!isChecked) {
      setError('Please agree to the Terms and Conditions');
      return;
    }
    setLoading(true);
    // Perform form submission logic here
    try {
      const res = await axiosInstance.post('/auth/register', {
        email,
        password,
        repeatPassword
      });
      alert(res.data.message);
      router.push('/signin')
    } catch (error: any) {
      setError(error.message);
    }
      finally {
      // Reset the form
      setEmail('');
      setIsValidEmail(false);
      // setError('');
      setLoading(false);

      }
  }


      return (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                className="form-input py-2 w-full"
                type="email"
                required
                onChange={handleEmailChange}
                // Add email validation
                // pattern={EMAIL_VALIDATION}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="password"
                className="form-input py-2 w-full"
                type="password"
                autoComplete="on"
                required
                onChange={handlePasswordChange}
                // Add password validation
                // pattern={PW_VALIDATION}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="repeat-password">
                Repeat Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="repeat-password"
                className="form-input py-2 w-full"
                type="password"
                autoComplete="off"
                required
                onChange={handleRepeatPasswordChange}
                // Add password validation
                // pattern={PW_VALIDATION}
              />
            </div>
            {error && <p className="text-sm font-bold text-rose-500">{error}</p>}
          </div>
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
              I agree to the <a href="support/privacy-policy" className="text-blue-600 underline">Privacy Policy</a> and <a href="support/terms-conditions" className="text-blue-600 underline">Terms and Conditions</a>.
            </label>
          </div>


          <div className="mt-6">
            <button
              disabled={loading}
              type="submit"
              className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Signing Up...
                </>
              ) : (
                <>
                  Sign Up<span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
                </>
              )}
            </button>
          </div>
        </form>
      )
    }

    export default Register

