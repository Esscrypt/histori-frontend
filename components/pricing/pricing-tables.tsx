'use client';

import { useState } from 'react';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useRouter } from 'next/navigation';

export default function PricingTables() {
  const [annual, setAnnual] = useState<boolean>(true);
  const router = useRouter(); // Using router for redirection

  // Function to create checkout session with token check
  const handleCheckoutSession = async (key: string) => {
    // Append "-yearly" to the key if annual billing is selected
    const lookupKey = annual ? `${key}-yearly` : key;

    // Check for access token
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to sign-in if token doesn't exist
      router.push('/signin');
      return;
    }

    try {
      const response = await axiosInstance.post('/payments/create-checkout-session', { lookup_key: lookupKey });
      const session = response.data;

      if (session.url) {
        window.location.href = session.url; // Redirect to Stripe Checkout
      } else {
        console.error('Error creating checkout session:', session.error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleContactUsRedirect = () => {
    router.push('/contact');
  };

  return (
    <div>
      {/* Pricing toggle */}
      <div className="flex justify-center items-center space-x-4 sm:space-x-7 mb-16">
        <div className="text-sm text-slate-500 font-medium text-right min-w-[8rem]">
          Pay Monthly
        </div>
        <div className="form-switch shrink-0">
          <input
            type="checkbox"
            id="toggle"
            className="sr-only"
            checked={annual}
            onChange={() => setAnnual(!annual)}
          />
          <label className="bg-slate-700" htmlFor="toggle">
            <span
              className="bg-slate-300 border-8 border-slate-500"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Pay annually</span>
          </label>
        </div>
        <div className="text-sm text-slate-500 font-medium min-w-[8rem]">
          Pay Yearly <span className="text-emerald-500">(-10%)</span>
        </div>
      </div>

      <div className="max-w-sm mx-auto grid gap-8 lg:grid-cols-3 lg:gap-6 items-start lg:max-w-none pt-4">
        {/* Pricing table 0 */}
        <div className="relative flex flex-col h-full px-6 py-5 bg-white shadow-lg" data-aos="fade-up">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <div className="text-lg font-semibold text-slate-800 mb-1">Free</div>
            <div className="inline-flex items-baseline mb-3">
              <span className="h3 font-medium text-slate-500">$</span>
              <span className="h2 leading-7 font-playfair-display text-slate-800">{annual ? '0' : '0'}</span>
              <span className="font-medium text-slate-400">/mo</span>
            </div>
            <div className="text-slate-500">
              Ideal for Testing and small-scale experimentation with limited data needs.
            </div>
          </div>
          <div className="font-medium mb-3">Features include:</div>
          <ul className="text-slate-500 space-y-3 grow mb-6">
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>5 Requests per second</span>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>5k API Credits</span>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>21 days Free Access</span>
            </li>
          </ul>
          <div className="p-3 rounded bg-slate-50">
            <a className="btn-sm text-white bg-blue-600 hover:bg-blue-700 w-full group" href="/signin">
              Start free trial{' '}
              <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                -&gt;
              </span>
            </a>
          </div>
        </div>

        {/* Pricing table 1 */}
        <div className="relative flex flex-col h-full px-6 py-5 bg-white shadow-lg" data-aos="fade-up">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <div className="text-lg font-semibold text-slate-800 mb-1">Starter</div>
            <div className="inline-flex items-baseline mb-3">
              <span className="h3 font-medium text-slate-500">$</span>
              <span className="h2 leading-7 font-playfair-display text-slate-800">{annual ? '45' : '50'}</span>
              <span className="font-medium text-slate-400">/mo</span>
            </div>
            <div className="text-slate-500">Better insights for startups or small applications requiring moderate API usage.</div>
          </div>
          <div className="font-medium mb-3">Features include:</div>
          <ul className="text-slate-500 space-y-3 grow mb-6">
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>50 Requests per second</span>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>50k API Credits per month</span>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>Full Histori development platform</span>
            </li>
          </ul>
          <div className="p-3 rounded bg-slate-50">
            <button
              className="btn-sm text-white bg-blue-600 hover:bg-blue-700 w-full group"
              onClick={() => handleCheckoutSession('starter')}
            >
              Get Started
              <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                -&gt;
              </span>
            </button>
          </div>
        </div>

        {/* Pricing table 2 */}
        <div className="relative flex flex-col h-full px-6 py-5 bg-white shadow-lg" data-aos="fade-up" data-aos-delay="100">
          <div className="absolute top-0 right-0 mr-6 -mt-4">
            <div className="inline-flex text-sm font-semibold py-1 px-3 text-emerald-700 bg-emerald-200 rounded-full">Most Popular</div>
          </div>
          <div className="mb-4 pb-4 border-b border-slate-200">
            <div className="text-lg font-semibold text-slate-800 mb-1">Growth</div>
            <div className="inline-flex items-baseline mb-3">
              <span className="h3 font-medium text-slate-500">$</span>
              <span className="h2 leading-7 font-playfair-display text-slate-800">{annual ? '180' : '200'}</span>
              <span className="font-medium text-slate-400">/mo</span>
            </div>
            <div className="text-slate-500">For growing businesses with higher API demands and steady growth.</div>
          </div>
          <div className="font-medium mb-3">All features of Growth plan:</div>
          <ul className="text-slate-500 space-y-3 grow mb-6">
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>50 Requests per second</span>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>300k API Credits per month</span>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>Discord chat support</span>
            </li>
          </ul>
          <div className="p-3 rounded bg-slate-50">
            <button
              className="btn-sm text-white bg-blue-600 hover:bg-blue-700 w-full group"
              onClick={() => handleCheckoutSession('growth')}
            >
              Get Started
              <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                -&gt;
              </span>
            </button>
          </div>
        </div>

        {/* Pricing table 3 */}
        <div className="relative flex flex-col h-full px-6 py-5 bg-white shadow-lg" data-aos="fade-up" data-aos-delay="200">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <div className="text-lg font-semibold text-slate-800 mb-1">Business</div>
            <div className="inline-flex items-baseline mb-3">
              <span className="h3 font-medium text-slate-500">$</span>
              <span className="h2 leading-7 font-playfair-display text-slate-800">{annual ? '360' : '400'}</span>
              <span className="font-medium text-slate-400">/mo</span>
            </div>
            <div className="text-slate-500">
              Better insights for Larger businesses or enterprises requiring extensive data access.
            </div>
          </div>
          <div className="font-medium mb-3">All features of Business plan:</div>
          <ul className="text-slate-500 space-y-3 grow mb-6">
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>50 Requests per second</span>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>700k API credits per month</span>
            </li>
            <li className="flex items-center">
              <svg className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>Priority integration support</span>
            </li>
          </ul>
          <div className="p-3 rounded bg-slate-50">
            <button
              className="btn-sm text-white bg-blue-600 hover:bg-blue-700 w-full group"
              onClick={() => handleCheckoutSession('business')}
            >
              Get Started
              <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                -&gt;
              </span>
            </button>
          </div>
        </div>

         {/* Pricing table 4 - Enterprise */}
         <div className="relative flex flex-col h-full px-6 py-5 bg-white shadow-lg" data-aos="fade-up" data-aos-delay="300">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <div className="text-lg font-semibold text-slate-800 mb-1">
              Enterprise
            </div>
            <div className="inline-flex items-baseline mb-3">
              <span className="h2 leading-7 font-playfair-display text-slate-800">
                Custom
              </span>
            </div>
            <div className="text-slate-500">
              Ideal for large-scale businesses with high API usage requirements and custom support.
            </div>
          </div>
          <div className="font-medium mb-3">Custom features include:</div>
          <ul className="text-slate-500 space-y-3 grow mb-6">
            <li className="flex items-center">
              <svg
                className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0"
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>Custom API Requests</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0"
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>Custom API Credits</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0"
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span>Priority Enterprise Support</span>
            </li>
          </ul>
          <div className="p-3 rounded bg-slate-50">
            <button
              className="btn-sm text-white bg-blue-600 hover:bg-blue-700 w-full group"
              onClick={handleContactUsRedirect}
            >
              Contact Us
              <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                -&gt;
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
