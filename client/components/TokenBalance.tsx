'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useFHEReady } from '@/hooks/useFHE'
import { useConfidentialBalance } from '@/hooks/useFaucetContract'
import { decryptForUser, formatTokenAmount } from '@/lib/fhe'
import { CONTRACTS } from '@/lib/contracts'
import { Coins, Eye, EyeOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSigner } from '@/hooks/useSinger'

export function TokenBalance() {
  const { address, connector } = useAccount()
  const { isReady: isFHEReady, fheInstance } = useFHEReady()
  const { encryptedBalance } = useConfidentialBalance()

  const [decryptedBalance, setDecryptedBalance] = useState<bigint | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [decryptError, setDecryptError] = useState<string | null>(null)
  const [isBalanceVisible, setIsBalanceVisible] = useState(false)

  const { signer } = useSigner()

  const decryptBalance = useCallback(async () => {
    if (
      !address ||
      !encryptedBalance ||
      !isFHEReady ||
      !fheInstance ||
      !connector ||
      !signer
    ) {
      return
    }

    setIsDecrypting(true)
    setDecryptError(null)

    try {
      const balance = await decryptForUser(
        fheInstance,
        encryptedBalance as string,
        CONTRACTS.FAUCET_TOKEN.address,
        signer,
      )

      console.log('balance', balance)

      setDecryptedBalance(balance)
      setIsBalanceVisible(true)
    } catch (error) {
      console.error('Error decrypting balance:', error)
      setDecryptError('Failed to decrypt balance. Please try again.')
    } finally {
      setIsDecrypting(false)
    }
  }, [address, encryptedBalance, isFHEReady, fheInstance, connector, signer])

  const toggleBalanceVisibility = () => {
    if (isBalanceVisible) {
      setIsBalanceVisible(false)
      setDecryptedBalance(null)
    } else {
      decryptBalance()
    }
  }

  // Don't show if not connected
  if (!address) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        Token Balance
      </div>

      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Confidential Token
            </span>
            <span className="text-sm font-medium">
              {isBalanceVisible && decryptedBalance !== null
                ? formatTokenAmount(decryptedBalance)
                : '******'}
            </span>
          </div>
        </div>

        <button
          onClick={toggleBalanceVisibility}
          disabled={isDecrypting || !isFHEReady}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            'hover:bg-gray-100 dark:hover:bg-gray-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          title={isBalanceVisible ? 'Hide balance' : 'Show balance'}
        >
          {isDecrypting ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          ) : isBalanceVisible ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {decryptError && (
        <div className="text-xs text-red-500 dark:text-red-400">
          {decryptError}
        </div>
      )}
    </div>
  )
}
