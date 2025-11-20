import { http, createConfig, fallback } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''
const infuraRpcURL = process.env.NEXT_PUBLIC_INFURA_RPC_URL || ''

export const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId,

    appName: 'Zama Starter',
    appDescription:
      'Explore Zama FHE with Confidential USD transfers and swaps',
    appUrl: 'https://zama-starter.vercel.app',
    appIcon: 'https://zama-starter.vercel.app/favicon.ico', // your app's icon, no bigger than 1024x1024px (max. 1MB)

    chains: [sepolia],
    transports: {
      // RPC URL for each chain with fallback
      [sepolia.id]: fallback([
        http(infuraRpcURL),
        http('https://ethereum-sepolia-rpc.publicnode.com'),
      ]),
    },
  }),
)
