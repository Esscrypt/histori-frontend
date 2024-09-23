export const metadata = {
  title: 'Home - Histori',
  description: 'Blockchain historical data retrieval service',
}

import Hero from '@/components/hero/hero-home'
import FeaturesBlocks from '@/components/features/features-blocks'
import Features from '@/components/features/features-home'
import Features02 from '@/components/features/features-home-02'
import Features03 from '@/components/features/features-home-03'
import Target from '@/components/target'
import PricingSection from '@/components/pricing/pricing'
import Cta from '@/components/cta/cta'
import Faqs from '@/components/faqs'

export default function Home() {
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
  )
}
