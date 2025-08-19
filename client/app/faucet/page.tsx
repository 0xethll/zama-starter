'use client'

import { AppLayout } from '@/components/AppLayout'
import { useState } from 'react'
import {
  Coins,
  Shield,
  Info,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useFaucetData, useFaucetMint } from '@/hooks/useFaucetContract'
import { useFHEContext } from '@/contexts/FHEContext'

export default function FaucetPage() {
  const { address, isConnected } = useAccount()
  const {
    isFHEReady,
    fheError,
  } = useFHEContext()
  const isFHELoading = !isFHEReady && !fheError
  const { canClaim, timeUntilNextClaim, lastClaimDate } = useFaucetData()
  const {
    mintFaucetTokens,
    isLoading: isMintLoading,
    isInitiating,
    isConfirmed,
    error: mintError,
    canMint,
  } = useFaucetMint()

  const handleClaimTokens = async () => {
    try {
      await mintFaucetTokens()
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
              Confidential Token Faucet
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Claim test confidential tokens to try FHE transfers and swaps
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Confidential Test Tokens
                </h3>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>
                    • Receive 1000 confidential test tokens every 24 hours
                  </li>
                  <li>• Your balance is encrypted and only visible to you</li>
                  <li>• Use these tokens to test transfers and swaps</li>
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
                  <span className="font-semibold">CFDT</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Name:</span>
                  <span className="font-semibold">Confidential Token</span>
                </div>
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="font-semibold">Sepolia Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span>Claim Amount:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    1,000 CFDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cooldown:</span>
                  <span className="font-semibold">24 hours</span>
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
                <div className="flex justify-between">
                  <span>Last Claim:</span>
                  <span className="font-semibold">
                    {lastClaimDate
                      ? lastClaimDate.toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Can Claim:</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      canClaim
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    {canClaim ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                    {canClaim ? 'Yes' : 'Cooldown active'}
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
                  Claim Your Test Tokens
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get confidential test tokens to explore FHE functionality
                </p>
              </div>

              <button
                onClick={handleClaimTokens}
                disabled={
                  !isConnected || !canClaim || isMintLoading || !canMint
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
                  : 'Claim 1,000 Confidential Tokens'}
              </button>

              {!isConnected && (
                <p className="text-center text-sm text-red-600 dark:text-red-400">
                  Please connect your wallet to the Sepolia network to claim
                  tokens
                </p>
              )}

              {isConnected && !canClaim && (
                <p className="text-center text-sm text-yellow-600 dark:text-yellow-400">
                  You can claim tokens again in{' '}
                  {Math.ceil(timeUntilNextClaim / (60 * 60 * 1000))} hours
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
                  <span>Successfully claimed 1,000 confidential tokens!</span>
                </div>
              )}

              {isFHELoading && (
                <p className="text-center text-sm text-blue-600 dark:text-blue-400">
                  Initializing FHE encryption... Please wait.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
