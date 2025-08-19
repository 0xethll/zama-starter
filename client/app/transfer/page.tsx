'use client'

import { Sidebar } from '@/components/sidebar'
import { useState } from 'react'
import { ArrowUpDown, Shield, Info } from 'lucide-react'
import { useAccount } from 'wagmi'

export default function TransferPage() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { address, isConnected } = useAccount()

  const handleTransfer = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement FHE token transfer logic
      console.log('Transfer:', { recipient, amount })
      alert('Transfer functionality will be implemented with smart contracts')
    } catch (error) {
      console.error('Transfer error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <ArrowUpDown className="h-8 w-8 primary-accent" />
              Confidential Token Transfer
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Transfer tokens while keeping amounts completely private using FHE
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  How FHE Transfers Work
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>
                    • Your transfer amount is encrypted before being sent to the
                    blockchain
                  </li>
                  <li>
                    • The smart contract performs operations on encrypted data
                  </li>
                  <li>
                    • No one can see the actual transfer amount, not even
                    validators
                  </li>
                  <li>
                    • Only the sender and recipient can decrypt their balance
                    information
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (will be encrypted)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Shield className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This amount will be encrypted and hidden from everyone except
                  you and the recipient
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Transaction Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>From:</span>
                    <span className="font-mono">
                      {address
                        ? `${address.slice(0, 6)}...${address.slice(-4)}`
                        : 'Not connected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span className="font-mono">
                      {recipient
                        ? `${recipient.slice(0, 6)}...${recipient.slice(-4)}`
                        : 'Enter address'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {amount || '0.0'} (encrypted)
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleTransfer}
                disabled={!isConnected || !recipient || !amount || isLoading}
                className="w-full primary-bg text-white py-3 px-4 rounded-md font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Send Confidential Transfer'}
              </button>

              {!isConnected && (
                <p className="text-center text-sm text-red-600 dark:text-red-400">
                  Please connect your wallet to the Sepolia network to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
