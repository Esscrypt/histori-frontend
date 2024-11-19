'use client';

import Link from 'next/link';
import Logo from './logo';
import MobileMenu from './mobile-menu';
import { useEffect, useState } from 'react';

export default function Header({ mode = 'dark' }: { mode?: string }) {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setHasToken(true); // Set state to true if token exists
    }
  }, []);

  return (
    <header className={`absolute w-full z-30 ${mode !== 'light' && 'dark'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Site branding */}
          <div className="shrink-0 mr-4">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">

            {/* Desktop menu links */}
            <ul className="flex grow justify-start flex-wrap items-center">
              <li>
                <Link
                  href="https://docs.histori.xyz"
                  className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                >
                  REST API Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing-multinode"
                  className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                >
                  Archival MultiNode Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                >
                  Contact Us
                </Link>
              </li>
            </ul>

            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              {hasToken ? (
                <li>
                  <Link
                    href="/dashboard"
                    className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href="/signin"
                    className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                  >
                    Sign in
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="https://docs.histori.xyz/docs/start/demo"
                  className="font-medium text-blue-600 dark:text-slate-300 dark:hover:text-white px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out group"
                >
                  Get Started{' '}
                  <span className="tracking-normal text-blue-600 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                    -&gt;
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
