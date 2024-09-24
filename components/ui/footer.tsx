import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Top area: Blocks */}
        <div className="grid sm:grid-cols-12 gap-8 py-8 md:py-12">

          {/* 1st block */}
          <div className="sm:col-span-12 lg:col-span-4 lg:max-w-xs">
            <div className="mb-2">
              {/* Logo */}
              <Link href="/" className="inline-flex text-blue-600 transition duration-150 ease-in-out" aria-label="Histori">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.25 4.116c.039.899-.51.468-.79.629-.894.524-1.491 2.04-2.612 2.125-.423.87-1.121.898-1.874 1.503-.327.256-.463.839-.756 1.097l-3.694 3.27a2.395 2.395 0 0 1-.44.314c-.378.219-.656.717-1.096.81-.475.106-1.601-.775-2.633-2.012-.825-1.587-.025-1.924.518-2.525.916-1.022 2.48-2.064 3.585-2.753.843-.537 1.677-1.13 2.59-1.482.935-.357 1.779-.842 2.738-1.041.7-.141 1.522.063 2.206 0a9.596 9.596 0 0 1 2.258.065M30.676 3.646c-.06 1.046-1.038.955-1.593 1.363C27.32 6.31 25.8 8.656 23.63 9.583c-1.07 1.412-2.411 1.952-4.056 3.254-.711.56-1.21 1.417-1.877 1.965-2.887 2.381-5.668 4.524-8.64 6.823-.303.236-.646.468-1.008.697-.834.528-1.675 1.394-2.543 1.77-.95.413-2.376-.279-3.375-1.544-.43-1.849 1.112-2.657 2.38-3.737 2.13-1.82 5.33-4.012 7.558-5.536 1.707-1.17 3.395-2.426 5.138-3.43 1.789-1.03 3.439-2.179 5.224-3.063 1.303-.643 2.758-.96 4.038-1.53a40.762 40.762 0 0 1 4.207-1.606M30.386 14.346c.229.918-.566.8-.896 1.136-1.048 1.058-1.721 3.056-3.254 3.7-.563 1.17-1.522 1.532-2.603 2.507-.464.426-.731 1.128-1.177 1.542-1.94 1.77-3.91 3.263-6.082 4.772a6.36 6.36 0 0 1-.748.43c-.618.313-1.24.914-1.901 1.065-.731.161-1.856-.807-2.662-2.199-.401-1.784.715-2.129 1.6-2.818 1.49-1.15 3.693-2.49 5.192-3.486 1.154-.755 2.247-1.633 3.417-2.292 1.2-.68 2.244-1.52 3.44-2.128.868-.448 1.927-.61 2.79-1.029.92-.447 1.873-.85 2.884-1.2" />
                </svg>
              </Link>
            </div>
            <div className="text-lg font-bold text-slate-800">Affordable historical blockchain data.</div>
          </div>

          {/* 2nd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-slate-800 font-semibold mb-2">Resources</h6>
            <ul className="text-sm font-medium space-y-2">
              <li>
                <a href="/pricing" className="text-slate-500 hover:text-blue-600 transition duration-150 ease-in-out">Pricing</a>
              </li>
              <li>
                <a href="https://docs.histori.xyz/" className="text-slate-500 hover:text-blue-600 transition duration-150 ease-in-out">API Documentation</a>
              </li>
              <li>
                <a href="/support/contact" className="text-slate-500 hover:text-blue-600 transition duration-150 ease-in-out">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* 3rd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-sm text-slate-800 font-semibold mb-2">Company</h6>
            <ul className="text-sm font-medium space-y-2">
              <li>
                <a href="/about" className="text-slate-500 hover:text-blue-600 transition duration-150 ease-in-out">About Us</a>
              </li>
              <li>
                <a href="/support/terms-conditions" className="text-slate-500 hover:text-blue-600 transition duration-150 ease-in-out">Terms of Use</a>
              </li>
              <li>
                <a href="/support/privacy-policy" className="text-slate-500 hover:text-blue-600 transition duration-150 ease-in-out">Privacy Policy</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom area */}
        <div className="md:flex md:items-center md:justify-between py-6 md:py-8 border-t border-slate-200">

          {/* Social links */}
          <ul className="flex space-x-6 mb-4 md:order-1 md:ml-4 md:mb-0">
            <li>
              <a className="text-blue-500 hover:text-blue-600 transition duration-150 ease-in-out" href="https://github.com/Esscrypt" aria-label="Github">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.041 0C4.52 0 0 4.612 0 10.25c0 4.526 2.845 8.37 6.862 9.737.502.085.669-.257.669-.513v-1.708c-2.761.598-3.347-1.367-3.347-1.367-.419-1.196-1.088-1.537-1.088-1.537-1.004-.598 0-.598 0-.598 1.004.085 1.506 1.025 1.506 1.025.92 1.537 2.343 1.11 2.929.854.084-.683.335-1.11.67-1.367-2.26-.256-4.603-1.11-4.603-5.039 0-1.11.419-2.05 1.004-2.733 0-.342-.418-1.367.168-2.733 0 0 .836-.257 2.76 1.025.838-.257 1.674-.342 2.511-.342.837 0 1.674.085 2.51.342 1.925-1.367 2.762-1.025 2.762-1.025.586 1.452.167 2.477.084 2.733.669.683 1.004 1.623 1.004 2.733 0 3.93-2.343 4.783-4.603 5.04.335.341.67.939.67 1.879v2.818c0 .256.167.598.67.513 4.016-1.367 6.86-5.21 6.86-9.737C20.084 4.612 15.565 0 10.042 0Z" />
                </svg>
              </a>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="text-sm text-slate-500 mr-4">© Histori. All rights reserved.</div>

        </div>

      </div>
    </footer>
  )
}