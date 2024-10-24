'use client';

// Import necessary Next.js and React modules
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Metadata for the page
// export const metadata = {
//   title: 'Home - Histori',
//   description: 'Blockchain historical data retrieval service',
// }

// Importing components
import Hero from '@/components/hero/hero-home';
import Target from '@/components/target';
import PricingSection from '@/components/pricing/pricing';
import Cta from '@/components/cta/cta';
import Faqs from '@/components/faqs';

export default function Home() {
  const router = useRouter();

  // Use useEffect to handle the redirect logic after the component is mounted
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('success') || undefined;

    const authToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null; // Check if auth token exists in localStorage

    // If success=true and user is logged in, redirect to the dashboard
    if (paymentSuccess === 'true' && authToken) {
      router.push('/dashboard'); // Redirect to the dashboard
    }
    
  }); // Run the effect when query parameters change

  return (
    <>
      <Hero />
      {/* <FeaturesBlocks />
      <Features /> */}
      {/* <Features02 />
      <Features03 /> */}
      <Target />
      <PricingSection />
      <Faqs />
      <Cta />
    </>
  );
}
