import PricingTablesMultinode from '../pricing/pricing-tables-multinode';

export default function HeroPricingMultinode() {  
  return (
    <section className="relative">

      {/* Dark background */}
      <div className="absolute inset-0 bg-slate-900 pointer-events-none -z-10 h-1/3 lg:h-[48rem] [clip-path:polygon(0_0,_5760px_0,_5760px_calc(100%_-_352px),_0_100%)]" aria-hidden="true"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 md:pt-40">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12">
            <h1 className="h1 font-playfair-display text-slate-100">The most secure, untracked, and reliable access to RPC services. Ensure seamless connectivity to blockchain networks, even in the face of node failures.</h1>
          </div>

          <PricingTablesMultinode />

        </div>
      </div>

    </section>
  )
}