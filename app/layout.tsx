import './css/style.css'
// import '@rainbow-me/rainbowkit/styles.css';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { WagmiProvider } from 'wagmi';
// import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

// import { config } from './wagmi';

// const queryClient = new QueryClient();

import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap'
})

export const metadata = {
  title: 'Histori',
  description: 'Blockchain historical data retrieval service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-inter antialiased bg-white text-slate-800 tracking-tight`}>
      {/* <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider> */}
            {children}
          {/* </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider> */}
      </body>
    </html>
  )
}
