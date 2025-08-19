import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

export const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId,

    appName: 'Zama Starter',
    appDescription:
      'Explore Zama FHE with confidential token transfers and swaps',
    appUrl: 'https://zama-starter.vercel.app',
    appIcon: 'https://zama-starter.vercel.app/favicon.ico', // your app's icon, no bigger than 1024x1024px (max. 1MB)

    chains: [sepolia],
    transports: {
      // RPC URL for each chain with fallback
      [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    },
  }),
)
