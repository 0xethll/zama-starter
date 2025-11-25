// Card-based display for token balances

'use client'

import { DollarSign, Shield, Eye, EyeOff } from 'lucide-react'
import { formatUnits } from 'viem'
import type { TokenPair } from '@/hooks/useTokenList'
import { useFHEContext } from '@/contexts/FHEContext'
import { formatTokenAmount } from '@/lib/fhe'
import { TokenIcon } from './TokenIcon'

interface TokenBalanceCardsProps {
  tokenPair: TokenPair
}

export function TokenBalanceCards({ tokenPair }: TokenBalanceCardsProps) {
  const {
    isBalanceVisible,
    decryptedBalance,
    setIsBalanceVisible,
  } = useFHEContext()

  const erc20Balance = formatUnits(
    tokenPair.erc20Balance,
    tokenPair.erc20Decimals
  )

  const confidentialBalance =
    isBalanceVisible && decryptedBalance !== null
      ? formatTokenAmount(decryptedBalance)
      : null

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ERC20 Token Balance Card */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                ERC20 Token
              </h3>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Available to wrap
            </p>
          </div>
          <TokenIcon symbol={tokenPair.erc20Symbol} size="md" />
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            {erc20Balance}
          </div>
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {tokenPair.erc20Symbol}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {tokenPair.erc20Name}
          </div>
        </div>
      </div>

      {/* Confidential Token Balance Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                Confidential Token
              </h3>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {tokenPair.wrappedAddress ? 'Encrypted balance' : 'Not created yet'}
            </p>
          </div>
          <TokenIcon
            symbol={tokenPair.erc20Symbol}
            isConfidential
            size="md"
          />
        </div>

        {tokenPair.wrappedAddress ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {isBalanceVisible && confidentialBalance !== null
                  ? confidentialBalance
                  : '******'}
              </div>
              <button
                onClick={toggleBalanceVisibility}
                disabled={!tokenPair.wrappedBalance}
                className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  isBalanceVisible ? 'Hide balance' : 'Decrypt and show balance'
                }
              >
                {isBalanceVisible ? (
                  <EyeOff className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                ) : (
                  <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                )}
              </button>
            </div>
            <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
              c{tokenPair.erc20Symbol}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {isBalanceVisible
                ? 'Balance decrypted'
                : 'Click eye icon to decrypt'}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-500 dark:text-gray-400">
              No wrapper yet
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Wrap tokens to create a confidential wrapper automatically
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
