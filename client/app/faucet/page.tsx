'use client'

import { AppLayout } from '@/components/AppLayout'

import {
  Coins,
  Shield,
  Info,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { cUSDMint } from '@/hooks/useFaucetContract'
import { useFHEContext } from '@/contexts/FHEContext'
import { useState } from 'react'
import { parseTokenAmount } from '@/lib/fhe'

export default function FaucetPage() {
  const { address, isConnected } = useAccount()
  const {
    isFHEReady,
    fheError,
  } = useFHEContext()
  const isFHELoading = !isFHEReady && !fheError
  const {
    mintcUSD,
    isLoading: isMintLoading,
    isInitiating,
    isConfirmed,
    error: mintError,
    canMint,
  } = cUSDMint()

  const [amount, setAmount] = useState('10')
  const [amountError, setAmountError] = useState('')

  const validateAmount = (value: string): boolean => {
    setAmountError('')

    if (!value || value.trim() === '') {
      setAmountError('Amount is required')
      return false
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setAmountError('Invalid amount')
      return false
    }

    if (numValue <= 0) {
      setAmountError('Amount must be greater than 0')
      return false
    }

    if (numValue > 10) {
      setAmountError('Amount must be less than or equal to 10')
      return false
    }

    return true
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (value) {
      validateAmount(value)
    } else {
      setAmountError('')
    }
  }

  const handleClaimTokens = async () => {
    try {
      if (!validateAmount(amount)) {
        return
      }

      const amountBigInt = parseTokenAmount(amount)
      await mintcUSD(amountBigInt)
    } catch (error) {
      console.error('Claim error:', error)
      alert(error instanceof Error ? error.message : 'Failed to claim tokens')
    }
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Coins className="h-8 w-8 primary-accent" />
              Token Faucets
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Claim Confidential USD for confidential FHE operations and regular ERC20 transactions
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Confidential USD
                </h3>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• Your balance is encrypted and only visible to you</li>
                  <li>• Use these tokens to test transfers and unwraps</li>
                  <li>• All operations maintain complete privacy</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 primary-accent" />
                Token Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Token Symbol:</span>
                  <span className="font-semibold">cUSD</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Name:</span>
                  <span className="font-semibold">Confidential USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="font-semibold">Sepolia Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Claim:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    10 cUSD
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 primary-accent" />
                Claim Status
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Wallet:</span>
                  <span className="font-mono">
                    {address
                      ? `${address.slice(0, 6)}...${address.slice(-4)}`
                      : 'Not connected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-full">
                  <Coins className="h-12 w-12 primary-accent" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Claim Your cUSD
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get confidential USD to explore FHE functionality
                </p>
              </div>

              <div className="w-full max-w-md mx-auto">
                <label htmlFor="amount" className="block text-sm font-medium mb-2 text-left">
                  Amount (max 10 cUSD)
                </label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  max="10"
                  step="0.000001"
                  disabled={!isConnected || isMintLoading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {amountError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1 text-left">
                    {amountError}
                  </p>
                )}
              </div>

              <button
                onClick={handleClaimTokens}
                disabled={
                  !isConnected || isMintLoading || !canMint || !!amountError || !amount
                }
                className={`w-full primary-bg text-white py-3 px-6 rounded-md font-medium hover:opacity-90 active:scale-95 active:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                  isInitiating ? 'scale-95 opacity-75' : ''
                }`}
              >
                {isFHELoading
                  ? 'Initializing FHE...'
                  : isInitiating
                  ? 'Preparing Transaction...'
                  : isMintLoading
                  ? 'Claiming...'
                  : `Claim ${amount || '0'} Confidential USDs`}
              </button>

              {isFHELoading && (
                <p className="text-center text-sm text-blue-600 dark:text-blue-400">
                  Initializing FHE encryption... Please wait.
                </p>
              )}

              {isFHEReady && !isConnected && (
                <p className="text-center text-sm text-red-600 dark:text-red-400">
                  Please connect your wallet to the Sepolia network to claim
                  tokens
                </p>
              )}

              {fheError && (
                <div className="flex items-center justify-center gap-2 text-center text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>FHE Error: {fheError}</span>
                </div>
              )}

              {mintError && (
                <div className="flex items-center justify-center gap-2 text-center text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>{mintError}</span>
                </div>
              )}

              {isConfirmed && (
                <div className="flex items-center justify-center gap-2 text-center text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>Successfully claimed {amount} Confidential USDs!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
