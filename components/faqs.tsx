import Accordion from '@/components/utils/accordion'

export default function Faqs() {
  return (
    <section className="bg-slate-50">

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-slate-50">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 font-playfair-display text-slate-800">Frequently Asked Questions</h2>
          </div>

          {/* Faqs */}
          <ul className="max-w-3xl mx-auto divide-y divide-slate-200">
            <Accordion title="What is Histori?">
              Histori is a platform providing affordable access to historical blockchain data via an easy-to-use API. We support multiple chains and offer various plans to meet your data needs.
            </Accordion>
            <Accordion title="How do I get started with Histori?">
              To get started, create an account, choose a subscription plan that suits your needs, and use your API key to access historical blockchain data. We also offer a free tier for basic usage.
            </Accordion>
            <Accordion title="What blockchains do you support?">
              Currently, Histori supports Ethereum and other EVM-compatible chains, but we are continuously expanding support to other blockchains based on demand.
            </Accordion>
            <Accordion title="Can I upgrade or downgrade at any time?" active>
              Yes, you can easily upgrade or downgrade your subscription at any time. Your new plan will take effect immediately, and any changes will be reflected in your account.
            </Accordion>
            <Accordion title="Do you offer custom plans for enterprises?">
              Yes, we offer custom plans for businesses with high data requirements. Contact us for more information about tailored solutions and pricing.
            </Accordion>
            <Accordion title="Is there a trial period for paid plans?">
              Yes, we offer a 21-day free trial, allowing you to explore our platform and decide if it's right for you.
            </Accordion>
            <Accordion title="How does Histori handle API rate limits?">
              API rate limits are based on your subscription tier. Each plan offers different request limits per month, and if you exceed your limit, you can upgrade your plan or wait for the next billing cycle.
            </Accordion>
            <Accordion title="Can I request a refund?">
              We offer refunds in case of billing issues or accidental charges. Please review our refund policy or contact support if you have concerns.
            </Accordion>
            <span className="block border-t border-gray-200" aria-hidden="true"></span>
          </ul>

        </div>
      </div>
    </section>
  )
}
