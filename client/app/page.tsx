import { Sidebar } from '@/components/sidebar'
import { Shield, Lock, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Zama Learning Platform</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Learn Fully Homomorphic Encryption (FHE) through hands-on experience with confidential tokens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Shield className="h-8 w-8 primary-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Confidential Transfers</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Transfer tokens while keeping amounts completely private using FHE
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Zap className="h-8 w-8 primary-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Private Swaps</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Swap tokens without revealing trade amounts or directions
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Lock className="h-8 w-8 primary-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Zero Leakage</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All operations are performed on encrypted data with no information leaks
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">What is FHE?</h2>
              <div className="prose dark:prose-invert">
                <p>
                  Fully Homomorphic Encryption (FHE) allows computations to be performed on encrypted data 
                  without decrypting it first. This revolutionary technology enables:
                </p>
                <ul>
                  <li><strong>Privacy-preserving computations:</strong> Perform calculations on encrypted data</li>
                  <li><strong>Confidential smart contracts:</strong> Execute logic without revealing inputs</li>
                  <li><strong>Zero-knowledge operations:</strong> Verify outcomes without exposing details</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Step 1: Connect Wallet</h4>
                  <p className="text-sm">Connect your wallet to the Sepolia testnet using the sidebar</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Step 2: Get Test Tokens</h4>
                  <p className="text-sm">Visit the Faucet to claim confidential test tokens</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Step 3: Try Features</h4>
                  <p className="text-sm">Experiment with confidential transfers and swaps</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
