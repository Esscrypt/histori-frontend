
export default function Target() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-slate-200">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 font-playfair-display text-slate-800 mb-3">Our Mission, Vision & Values</h2>
            <p className="text-xl text-slate-500">At Histori, we are committed to making historical blockchain data accessible, reliable, and affordable for developers, researchers, and enterprises across the world.</p>
          </div>

          {/* Section content */}
          <div className="max-w-xl mx-auto md:max-w-none flex flex-col md:flex-row md:items-center md:space-x-8 lg:space-x-16 xl:space-x-18 space-y-8 space-y-reverse md:space-y-0">

            {/* Content */}
            <div className="md:w-7/12 lg:w-1/2 order-1 md:order-none" data-aos="fade-right">
              <ul className="space-y-6">
                <li>
                  <div className="flex items-center mb-4">
                    <svg className="h-4 w-4 shrink-0 fill-current text-blue-500 mr-3">
                      <path d="M15.722 4.008C14.408 1.214 10.954-.635 7.318.203 5.6.596 4.072 1.561 2.919 2.757A10.57 10.57 0 0 0 .484 6.93C.03 8.458-.173 10.035.18 11.764c.191.862.518 1.683 1.146 2.479a4.876 4.876 0 0 0 2.256 1.522c1.635.469 3.156.192 4.41-.439 1.242-.615 2.298-1.769 2.494-3.094.094-.656-.537-.657-.69-.18-.781 2.126-3.715 2.534-5.265 1.579-1.568-.922-1.185-3.068-.294-4.801.89-1.729 2.454-3.02 3.92-3.338.376-.098.714-.121 1.026-.098.324.018.658.074.98.188.65.2 1.23.591 1.618 1 .27.3.575.386 1.002.461.436.061.95.117 1.499.045.535-.073 1.06-.287 1.41-.807.345-.504.462-1.348.03-2.273" />
                    </svg>
                    <div className="h2 font-playfair-display text-slate-800">Mission</div>
                  </div>
                  <div className="text-slate-500 text-lg">To empower individuals and organizations by providing easy, affordable access to accurate historical blockchain data through our API platform.</div>
                </li>
                <li>
                  <div className="flex items-center mb-4">
                    <svg className="h-4 w-4 shrink-0 fill-current text-rose-400 mr-3">
                      <path d="M15.722 4.008C14.408 1.214 10.954-.635 7.318.203 5.6.596 4.072 1.561 2.919 2.757A10.57 10.57 0 0 0 .484 6.93C.03 8.458-.173 10.035.18 11.764c.191.862.518 1.683 1.146 2.479a4.876 4.876 0 0 0 2.256 1.522c1.635.469 3.156.192 4.41-.439 1.242-.615 2.298-1.769 2.494-3.094.094-.656-.537-.657-.69-.18-.781 2.126-3.715 2.534-5.265 1.579-1.568-.922-1.185-3.068-.294-4.801.89-1.729 2.454-3.02 3.92-3.338.376-.098.714-.121 1.026-.098.324.018.658.074.98.188.65.2 1.23.591 1.618 1 .27.3.575.386 1.002.461.436.061.95.117 1.499.045.535-.073 1.06-.287 1.41-.807.345-.504.462-1.348.03-2.273" />
                    </svg>
                    <div className="h2 font-playfair-display text-slate-800">Vision</div>
                  </div>
                  <div className="text-slate-500 text-lg">To be the most trusted and widely-used platform for historical blockchain data, transforming the way data is accessed and used across industries.</div>
                </li>
                <li>
                  <div className="flex items-center mb-4">
                    <svg className="h-4 w-4 shrink-0 fill-current text-yellow-400 mr-3">
                      <path d="M15.722 4.008C14.408 1.214 10.954-.635 7.318.203 5.6.596 4.072 1.561 2.919 2.757A10.57 10.57 0 0 0 .484 6.93C.03 8.458-.173 10.035.18 11.764c.191.862.518 1.683 1.146 2.479a4.876 4.876 0 0 0 2.256 1.522c1.635.469 3.156.192 4.41-.439 1.242-.615 2.298-1.769 2.494-3.094.094-.656-.537-.657-.69-.18-.781 2.126-3.715 2.534-5.265 1.579-1.568-.922-1.185-3.068-.294-4.801.89-1.729 2.454-3.02 3.92-3.338.376-.098.714-.121 1.026-.098.324.018.658.074.98.188.65.2 1.23.591 1.618 1 .27.3.575.386 1.002.461.436.061.95.117 1.499.045.535-.073 1.06-.287 1.41-.807.345-.504.462-1.348.03-2.273" />
                    </svg>
                    <div className="h2 font-playfair-display text-slate-800">Values</div>
                  </div>
                  <div className="text-slate-500 text-lg">Transparency, reliability, affordability, and innovation are at the core of everything we do.</div>
                </li>
              </ul>
            </div>

            {/* Image */}
            <div className="md:w-5/12 lg:w-1/2" data-aos="fade-left">
              <img className="mx-auto md:max-w-none" src="/images/values.webp" width={540} height={540} alt="Target" />
            </div>

          </div>

          {/* Business Statistics */}
          <div className="mt-12 max-w-3xl mx-auto text-center">
            <h3 className="h3 font-playfair-display text-slate-800 mb-4">Our Impact</h3>
            <div className="text-lg text-slate-500 mb-8">Since our inception, we've made significant strides in blockchain data access.</div>
            <ul className="flex justify-around text-slate-800">
              <li>
                <div className="h2 font-playfair-display text-blue-500">20M+</div>
                <div className="text-slate-500">Blocks Scraped</div>
              </li>
              <li>
                <div className="h2 font-playfair-display text-rose-400">100M+</div>
                <div className="text-slate-500">Transactions Processed</div>
              </li>
              <li>
                <div className="h2 font-playfair-display text-yellow-400">1,500+</div>
                <div className="text-slate-500">Active Users</div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
