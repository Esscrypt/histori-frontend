export const metadata = {
  title: 'RPC Router Pricing - Histori',
  description: 'Pricing for the Histori MultiNode - RPC Router',
}

import HeroPricingMultinode from '@/components/hero/hero-pricing-multinode'
import FeaturesMultinodeTable from '@/components/features-table-multinode'
import Faqs from '@/components/faqs'

export default function Pricing() {
  return (
    <>
      <HeroPricingMultinode />
      {/* <CtaPricing /> */}
      {/* <Features /> */}
      <FeaturesMultinodeTable />
      <Faqs />
      {/* <Cta /> */}
    </>
  )
}
