'use client'


import axiosInstance from '@/lib/axios/axiosInstance'
import React, { useState } from 'react'

const EMAIL_VALIDATION = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PW_VALIDATION = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/

    const Register = () => {

      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [repeatPassword, setRepeatPassword] = useState('');
      const [isValidEmail, setIsValidEmail] = useState(false);
      const [error, setError] = useState('');

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

const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setPassword(value);
}
const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setRepeatPassword(value);
}

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Perform form submission logic here
        try {
          axiosInstance.post('/auth/register', {
            email,
            password,
            repeatPassword
          });
        } catch (error) {
          
        }
         finally {
          // Reset the form
          setEmail('');
          setIsValidEmail(false);
          setError('');

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
                // Add password validation
                // pattern={PW_VALIDATION}
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group">
              Sign up<span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
            </button>
          </div>
        </form>
      )
    }

    export default Register

