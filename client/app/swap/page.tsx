'use client'

import { AppLayout } from '@/components/AppLayout'
import { useState } from 'react'
import { Repeat2, Shield, Info, ArrowUpDown } from 'lucide-react'
import { useAccount } from 'wagmi'

export default function SwapPage() {
  const [tokenA, setTokenA] = useState('TokenA')
  const [tokenB, setTokenB] = useState('TokenB')
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { address, isConnected } = useAccount()

  const handleSwap = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement FHE token swap logic
      console.log('Swap:', { tokenA, tokenB, amountA, amountB })
      alert('Swap functionality will be implemented with smart contracts')
    } catch (error) {
      console.error('Swap error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const swapTokens = () => {
    setTokenA(tokenB)
    setTokenB(tokenA)
    setAmountA(amountB)
    setAmountB(amountA)
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Repeat2 className="h-8 w-8 primary-accent" />
              Confidential Token Swap
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Swap tokens without revealing trade amounts or directions
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  FHE Swap Privacy Features
                </h3>
                <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                  <li>
                    • Swap amounts are encrypted and hidden from all observers
                  </li>
                  <li>• Trade direction is obfuscated using dummy transfers</li>
                  <li>
                    • AMM performs operations on encrypted data without
                    revealing liquidity
                  </li>
                  <li>• No MEV (Maximal Extractable Value) attacks possible</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="space-y-6">
              {/* Token A Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">From</label>
                <div className="flex gap-3">
                  <select
                    value={tokenA}
                    onChange={(e) => setTokenA(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="TokenA">TokenA</option>
                    <option value="TokenB">TokenB</option>
                    <option value="USDC">USDC</option>
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={amountA}
                      onChange={(e) => setAmountA(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Shield className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Swap Direction Button */}
              <div className="flex justify-center">
                <button
                  onClick={swapTokens}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </div>

              {/* Token B Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">To</label>
                <div className="flex gap-3">
                  <select
                    value={tokenB}
                    onChange={(e) => setTokenB(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="TokenA">TokenA</option>
                    <option value="TokenB">TokenB</option>
                    <option value="USDC">USDC</option>
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={amountB}
                      onChange={(e) => setAmountB(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Shield className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Swap Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>You pay:</span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {amountA || '0.0'} {tokenA} (encrypted)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>You receive:</span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {amountB || '0.0'} {tokenB} (encrypted)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exchange rate:</span>
                    <span>1:1 (simplified)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Privacy level:</span>
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Fully encrypted
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSwap}
                disabled={
                  !isConnected ||
                  !amountA ||
                  !amountB ||
                  tokenA === tokenB ||
                  isLoading
                }
                className="w-full primary-bg text-white py-3 px-4 rounded-md font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Execute Confidential Swap'}
              </button>

              {!isConnected && (
                <p className="text-center text-sm text-red-600 dark:text-red-400">
                  Please connect your wallet to the Sepolia network to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
