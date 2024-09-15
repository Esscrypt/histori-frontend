export const metadata = {
  title: 'Pricing - Tidy',
  description: 'Page description',
}

import Hero from '@/components/hero/hero-pricing'
import CtaPricing from '@/components/cta/cta-pricing'
import Features from '@/components/features/features-pricing'
import FeaturesTable from '@/components/features-table'
import Faqs from '@/components/faqs'
import Cta from '@/components/cta/cta-dark'

export default function Pricing() {
  return (
    <>
      <Hero />
      <CtaPricing />
      <Features />
      <FeaturesTable />
      <Faqs />
      <Cta />
    </>
  )
}
