// Tabbed interface for Wrap, Unwrap, and Transfer operations

'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ArrowUpDown,
  Shield,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { toHex } from 'viem'
import type { TokenPair } from '@/hooks/useTokenList'
import {
  useWrapToken,
  useUnwrapToken,
  useUsdAllowance,
  useUsdApproval,
} from '@/hooks/useWrapUnwrap'
import { useTransferContract } from '@/hooks/useTransferContract'
import { useFHEContext } from '@/contexts/FHEContext'
import { useConfidentialBalance } from '@/contexts/ConfidentialBalanceContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { encryptUint64, formatTokenAmount } from '@/lib/fhe'
import { UnwrapRequestsList } from '@/components/UnwrapRequestsList'
import { useUnwrapRequests } from '@/hooks/useUnwrapRequests'
import { useCreateWrappedToken } from '@/hooks/useFactoryContract'
import { WrapProgressIndicator, type WrapStep } from './WrapProgressIndicator'

type TabType = 'wrap' | 'unwrap' | 'transfer'

interface TokenOperationsTabsProps {
  tokenPair: TokenPair
  onOperationComplete?: () => void
}

export function TokenOperationsTabs({
  tokenPair,
  onOperationComplete,
}: TokenOperationsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('wrap')

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('wrap')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'wrap'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Wrap
          </button>
          <button
            onClick={() => setActiveTab('unwrap')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'unwrap'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Unwrap
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'transfer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Transfer
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'wrap' && (
        <WrapTab tokenPair={tokenPair} onComplete={onOperationComplete} />
      )}
      {activeTab === 'unwrap' && (
        <UnwrapTab tokenPair={tokenPair} onComplete={onOperationComplete} />
      )}
      {activeTab === 'transfer' && (
        <TransferTab tokenPair={tokenPair} onComplete={onOperationComplete} />
      )}
    </div>
  )
}

// Wrap Tab Component with Auto Wrapper Creation
function WrapTab({
  tokenPair,
  onComplete,
}: {
  tokenPair: TokenPair
  onComplete?: () => void
}) {
  const { address } = useAccount()
  const { clearBalance } = useConfidentialBalance()
  const [wrapAmount, setWrapAmount] = useState('')
  const [currentStep, setCurrentStep] = useState<WrapStep | null>(null)
  const [completedSteps, setCompletedSteps] = useState<WrapStep[]>([])

  // Refs to track if auto-continue has been triggered (prevent duplicate calls)
  const approvalCompletedRef = useRef(false)
  const wrapperCreatedContinuedRef = useRef(false)

  // Check if wrapper needs to be created
  const needsWrapperCreation = !tokenPair.wrappedAddress

  // Wrapper creation hook
  const {
    createWrapper,
    isLoading: isCreatingWrapper,
    isConfirmed: isWrapperCreated,
    error: wrapperError,
  } = useCreateWrappedToken()

  const { allowance: usdAllowance, refetchAllowance } = useUsdAllowance()
  const {
    approveTokens,
    isApproving,
    isConfirmed: isApprovalConfirmed,
    approvalError,
    resetApproval,
  } = useUsdApproval()

  const {
    wrapTokens,
    isWrapping,
    isConfirmed: isWrapConfirmed,
    wrapError,
    resetWrap,
  } = useWrapToken()

  // Handle wrapper creation completion
  useEffect(() => {
    if (isWrapperCreated) {
      setCompletedSteps((prev) => [...prev, 'create'])
      setCurrentStep(null)
      // Wait for confirmation and refetch to get the new wrapper address
      setTimeout(() => {
        onComplete?.()
        // Note: After refetch, tokenPair will update and trigger auto-continue effect
      }, 2000)
    }
  }, [isWrapperCreated, onComplete])

  // Auto-continue after wrapper is created and tokenPair updates
  useEffect(() => {
    // If we just completed 'create' step and now have a wrapper address, continue automatically
    if (
      completedSteps.includes('create') &&
      !completedSteps.includes('approve') &&
      !completedSteps.includes('wrap') &&
      tokenPair.wrappedAddress &&
      wrapAmount &&
      !currentStep &&
      address &&
      !wrapperCreatedContinuedRef.current  // Prevent duplicate execution
    ) {
      wrapperCreatedContinuedRef.current = true
      console.log('✅ Wrapper created, auto-continuing to next step...')

      // Check if approval is needed
      const wrapAmountWei = parseUnits(wrapAmount, tokenPair.erc20Decimals)
      const hasInsufficientAllowance =
        usdAllowance !== undefined && wrapAmountWei > usdAllowance

      setTimeout(() => {
        if (hasInsufficientAllowance) {
          setCurrentStep('approve')
          approveTokens(wrapAmount)
        } else {
          setCurrentStep('wrap')
          wrapTokens(wrapAmount)
        }
      }, 500)
    }
  }, [
    tokenPair.wrappedAddress,
    completedSteps,
    wrapAmount,
    currentStep,
    address,
  ])  // Remove function dependencies

  // Reset wrapper continued ref when wrapper address changes
  useEffect(() => {
    wrapperCreatedContinuedRef.current = false
  }, [tokenPair.wrappedAddress])

  // Refetch allowance after approval and auto-continue to wrap
  useEffect(() => {
    if (isApprovalConfirmed && !approvalCompletedRef.current) {
      approvalCompletedRef.current = true
      setCompletedSteps((prev) => [...prev, 'approve'])
      setCurrentStep(null)
      refetchAllowance()

      // Auto-continue to wrap step after allowance is refreshed
      setTimeout(() => {
        if (
          wrapAmount &&
          !completedSteps.includes('wrap') &&
          !isWrapping &&
          !currentStep
        ) {
          console.log('✅ Approval completed, auto-continuing to wrap...')
          setCurrentStep('wrap')
          wrapTokens(wrapAmount)
        }
      }, 1000)
    }
  }, [isApprovalConfirmed, completedSteps, isWrapping, currentStep])  // Remove function dependencies

  // Reset approval ref when approval state changes
  useEffect(() => {
    if (!isApprovalConfirmed) {
      approvalCompletedRef.current = false
    }
  }, [isApprovalConfirmed])

  // Trigger parent refetch after successful wrap
  useEffect(() => {
    if (isWrapConfirmed) {
      setCompletedSteps((prev) => [...prev, 'wrap'])
      setCurrentStep(null)
      // Clear the decrypted balance cache after wrapping
      if (tokenPair.wrappedAddress) {
        clearBalance(tokenPair.wrappedAddress)
      }
      setTimeout(() => {
        onComplete?.()
        setWrapAmount('')
        setCompletedSteps([])
      }, 2000)
    }
  }, [isWrapConfirmed, onComplete, tokenPair.wrappedAddress, clearBalance])

  // Handle wrapper creation error
  useEffect(() => {
    if (wrapperError) {
      setCurrentStep(null)
      // Don't clear completedSteps - keep track of what was done
      wrapperCreatedContinuedRef.current = false
    }
  }, [wrapperError])

  // Handle approval error - auto-clear after delay to allow retry
  useEffect(() => {
    if (approvalError) {
      setCurrentStep(null)
      approvalCompletedRef.current = false

      // Auto-clear error after 3 seconds to allow retry
      const timer = setTimeout(() => {
        resetApproval()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [approvalError, resetApproval])

  // Handle wrap error - auto-clear after delay to allow retry
  useEffect(() => {
    if (wrapError) {
      setCurrentStep(null)

      // Auto-clear error after 3 seconds to allow retry
      const timer = setTimeout(() => {
        resetWrap()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [wrapError, resetWrap])

  // Handle unified wrap action
  const handleWrapAction = async () => {
    if (!wrapAmount || !address) return

    try {
      // Step 1: Create wrapper if needed
      if (needsWrapperCreation) {
        setCurrentStep('create')
        await createWrapper(tokenPair.erc20Address)
        return // Wait for wrapper creation to complete
      }

      // Step 2: Approve if needed
      const wrapAmountWei = parseUnits(wrapAmount, tokenPair.erc20Decimals)
      const hasInsufficientAllowance =
        usdAllowance !== undefined && wrapAmountWei > usdAllowance
      if (hasInsufficientAllowance) {
        setCurrentStep('approve')
        approveTokens(wrapAmount)
        return // Wait for approval to complete
      }

      // Step 3: Wrap
      setCurrentStep('wrap')
      wrapTokens(wrapAmount)
    } catch (error) {
      console.error('Wrap action error:', error)
      setCurrentStep(null)
    }
  }

  const maxWrapAmount = formatUnits(
    tokenPair.erc20Balance,
    tokenPair.erc20Decimals
  )

  const canWrap =
    address &&
    wrapAmount &&
    parseFloat(wrapAmount) > 0 &&
    parseFloat(wrapAmount) <= parseFloat(maxWrapAmount)

  const isProcessing = isCreatingWrapper || isApproving || isWrapping

  // Determine button text
  const getButtonText = () => {
    if (isCreatingWrapper) return 'Creating Wrapper...'
    if (isApproving) return 'Approving...'
    if (isWrapping) return 'Wrapping...'
    return 'Wrap Tokens'
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Shield className="h-6 w-6 text-purple-600" />
        Wrap {tokenPair.erc20Symbol} Tokens
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Convert your {tokenPair.erc20Symbol} tokens to confidential{' '}
        {tokenPair.erc20Symbol} tokens
      </p>

      <div className="space-y-4">
        {/* Progress indicator */}
        <WrapProgressIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          needsWrapperCreation={needsWrapperCreation}
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            Amount to Wrap
          </label>
          <div className="relative">
            <input
              type="number"
              value={wrapAmount}
              onChange={(e) => setWrapAmount(e.target.value)}
              placeholder="0.0"
              disabled={isProcessing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-lg disabled:opacity-50"
              max={maxWrapAmount}
              step="any"
            />
            <button
              onClick={() => setWrapAmount(maxWrapAmount)}
              disabled={isProcessing}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700 text-sm font-medium disabled:opacity-50"
            >
              MAX
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Balance: {maxWrapAmount} {tokenPair.erc20Symbol}
          </div>
        </div>

        <button
          onClick={handleWrapAction}
          disabled={!canWrap || isProcessing}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {getButtonText()}
            </>
          ) : (
            getButtonText()
          )}
        </button>

        {/* Error messages */}
        {(wrapperError || approvalError || wrapError) && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{wrapperError || approvalError || wrapError}</span>
          </div>
        )}

        {/* Success message */}
        {isWrapConfirmed && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span>Successfully wrapped tokens!</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Unwrap Tab Component
function UnwrapTab({
  tokenPair,
  onComplete,
}: {
  tokenPair: TokenPair
  onComplete?: () => void
}) {
  const { address } = useAccount()
  const { isFHEReady, fheInstance, fheError } = useFHEContext()
  const { getBalanceState, clearBalance, getDecryptionRequirements } = useConfidentialBalance()
  const sidebar = useSidebar()
  const [unwrapAmount, setUnwrapAmount] = useState('')
  const [isPreparingUnwrap, setIsPreparingUnwrap] = useState(false)

  // Get balance state for this specific token
  const balanceState = tokenPair.wrappedAddress
    ? getBalanceState(tokenPair.wrappedAddress)
    : null

  const isBalanceVisible =
    balanceState?.decryptedBalance !== null &&
    balanceState?.decryptedBalance !== undefined &&
    !balanceState?.error

  // Check decryption requirements (needed for unwrap since we encrypt the amount)
  const decryptionStatus = getDecryptionRequirements()

  const { requests: unwrapRequests, isLoading: isLoadingRequests, error: requestsError, refetch: refetchRequests } = useUnwrapRequests()

  const {
    unwrapTokens,
    isUnwrapping,
    isConfirmed: isUnwrapConfirmed,
    unwrapError,
  } = useUnwrapToken(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    for (let i = 0; i < 3; i++) {
      await refetchRequests()
      if (i < 2) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }
  })

  useEffect(() => {
    if (isUnwrapConfirmed || unwrapError) {
      setIsPreparingUnwrap(false)
      if (isUnwrapConfirmed) {
        // Clear the decrypted balance cache after unwrapping
        if (tokenPair.wrappedAddress) {
          clearBalance(tokenPair.wrappedAddress)
        }
        setTimeout(() => {
          onComplete?.()
          setUnwrapAmount('')
        }, 2000)
      }
    }
  }, [isUnwrapConfirmed, unwrapError, onComplete, tokenPair.wrappedAddress, clearBalance])

  const handleUnwrap = async () => {
    if (!unwrapAmount || !address || !isFHEReady || !fheInstance) return

    setIsPreparingUnwrap(true)

    try {
      const amountWei = parseUnits(unwrapAmount, tokenPair.erc20Decimals)
      const { handle, proof } = await encryptUint64(
        fheInstance,
        tokenPair.wrappedAddress!,
        address,
        amountWei
      )

      unwrapTokens(
        toHex(handle) as `0x${string}`,
        toHex(proof) as `0x${string}`
      )
      setIsPreparingUnwrap(false)
    } catch (error) {
      console.error('Unwrap error:', error)
      setIsPreparingUnwrap(false)
    }
  }

  const maxUnwrapAmount =
    balanceState?.decryptedBalance
      ? formatTokenAmount(balanceState.decryptedBalance)
      : '0'

  const canUnwrap =
    address &&
    isFHEReady &&
    unwrapAmount &&
    parseFloat(unwrapAmount) > 0 &&
    parseFloat(unwrapAmount) <= parseFloat(maxUnwrapAmount) &&
    tokenPair.wrappedBalance

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-blue-600" />
          Unwrap to {tokenPair.erc20Symbol} Tokens
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Convert your wrapped Confidential {tokenPair.erc20Symbol} tokens back
          to regular {tokenPair.erc20Symbol} tokens
        </p>

        <div className="space-y-4">
          {/* Warning if confidential token doesn't exist */}
          {!tokenPair.wrappedAddress && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Confidential Token Not Created
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  You need to wrap {tokenPair.erc20Symbol} tokens first to create the confidential token wrapper. Go to the Wrap tab to get started.
                </p>
              </div>
            </div>
          )}

          {/* Warning if system requirements not met */}
          {tokenPair.wrappedAddress && !decryptionStatus.canDecrypt && (
            <button
              onClick={() => sidebar.open()}
              className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg w-full text-left hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors group"
            >
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1 flex items-center gap-2">
                  System Requirements Not Met
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {decryptionStatus.missingMessage}. Click to view system status details.
                </p>
              </div>
            </button>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Amount to Unwrap
            </label>
            <div className="relative">
              <input
                type="number"
                value={unwrapAmount}
                onChange={(e) => setUnwrapAmount(e.target.value)}
                placeholder="0.0"
                disabled={!tokenPair.wrappedAddress}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-lg disabled:opacity-50"
                max={maxUnwrapAmount}
                step="any"
              />
              <button
                onClick={() => setUnwrapAmount(maxUnwrapAmount)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                disabled={!isBalanceVisible || !tokenPair.wrappedAddress}
              >
                MAX
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {!tokenPair.wrappedAddress
                ? 'Confidential token not created yet'
                : isBalanceVisible
                ? `Balance: ${maxUnwrapAmount} c${tokenPair.erc20Symbol}`
                : 'Decrypt wrapped balance to view available amount'}
            </div>
          </div>

          {/* Warning if balance not decrypted */}
          {tokenPair.wrappedAddress && !isBalanceVisible && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Decrypt Balance First
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Click the eye icon on the Confidential Token balance card above to decrypt and verify your available balance before unwrapping.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleUnwrap}
            disabled={!canUnwrap || isUnwrapping || isPreparingUnwrap || !tokenPair.wrappedAddress || !decryptionStatus.canDecrypt}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            title={
              !decryptionStatus.canDecrypt
                ? decryptionStatus.missingMessage || 'System requirements not met'
                : 'Unwrap tokens'
            }
          >
            {isPreparingUnwrap ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : isUnwrapping ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Unwrapping...
              </>
            ) : (
              'Unwrap Tokens'
            )}
          </button>

          {!isFHEReady && !fheError && (
            <p className="text-center text-sm text-blue-600 dark:text-blue-400">
              Initializing FHE encryption... Please wait.
            </p>
          )}

          {fheError && (
            <div className="flex items-center justify-center gap-2 text-center text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>FHE Error: {fheError}</span>
            </div>
          )}

          {unwrapError && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>{unwrapError}</span>
            </div>
          )}

          {isUnwrapConfirmed && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span>Successfully unwrapped tokens!</span>
            </div>
          )}
        </div>
      </div>

      {/* Unwrap Requests List */}
      {address && (
        <UnwrapRequestsList
          requests={unwrapRequests}
          isLoading={isLoadingRequests}
          error={requestsError}
          refetch={refetchRequests}
        />
      )}
    </div>
  )
}

// Transfer Tab Component
function TransferTab({
  tokenPair,
  onComplete,
}: {
  tokenPair: TokenPair
  onComplete?: () => void
}) {
  const { address } = useAccount()
  const { isFHEReady, fheError } = useFHEContext()
  const { getBalanceState, clearBalance, getDecryptionRequirements } = useConfidentialBalance()
  const sidebar = useSidebar()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  // Get balance state for this specific token
  const balanceState = tokenPair.wrappedAddress
    ? getBalanceState(tokenPair.wrappedAddress)
    : null

  const isBalanceVisible =
    balanceState?.decryptedBalance !== null &&
    balanceState?.decryptedBalance !== undefined &&
    !balanceState?.error

  // Check decryption requirements (needed for transfer since we use FHE)
  const decryptionStatus = getDecryptionRequirements()

  const {
    transfer,
    isLoading: isTransferLoading,
    isInitiating,
    isConfirmed,
    error: transferError,
    canTransfer,
    txHash,
  } = useTransferContract()

  useEffect(() => {
    if (isConfirmed) {
      // Clear the decrypted balance cache after transfer
      if (tokenPair.wrappedAddress) {
        clearBalance(tokenPair.wrappedAddress)
      }
      setTimeout(() => {
        onComplete?.()
        setRecipient('')
        setAmount('')
      }, 2000)
    }
  }, [isConfirmed, onComplete, tokenPair.wrappedAddress, clearBalance])

  const handleTransfer = async () => {
    try {
      const transferAmount = parseInt(amount)
      await transfer(recipient, transferAmount)
    } catch (error) {
      console.error('Transfer error:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ArrowUpDown className="h-6 w-6 text-blue-600" />
        Confidential {tokenPair.erc20Symbol} Transfer
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Transfer tokens while keeping amounts completely private using FHE
      </p>

      <div className="space-y-6">
        {/* Warning if confidential token doesn't exist */}
        {!tokenPair.wrappedAddress && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                Confidential Token Not Created
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                You need to wrap {tokenPair.erc20Symbol} tokens first to create the confidential token wrapper. Go to the Wrap tab to get started.
              </p>
            </div>
          </div>
        )}

        {/* Warning if system requirements not met */}
        {tokenPair.wrappedAddress && !decryptionStatus.canDecrypt && (
          <button
            onClick={() => sidebar.open()}
            className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg w-full text-left hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors group"
          >
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1 flex items-center gap-2">
                System Requirements Not Met
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {decryptionStatus.missingMessage}. Click to view system status details.
              </p>
            </div>
          </button>
        )}

        {/* Warning if balance not decrypted */}
        {tokenPair.wrappedAddress && !isBalanceVisible && decryptionStatus.canDecrypt && (
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Decrypt Balance First
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Click the eye icon on the Confidential Token balance card above to decrypt and verify your available balance before transferring.
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={!tokenPair.wrappedAddress}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
              disabled={!tokenPair.wrappedAddress}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <Shield className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {!tokenPair.wrappedAddress
              ? 'Confidential token not created yet'
              : isBalanceVisible && balanceState?.decryptedBalance
              ? `Available: ${formatTokenAmount(balanceState.decryptedBalance)} c${tokenPair.erc20Symbol}`
              : 'This amount will be encrypted and hidden from everyone except you and the recipient'}
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
          disabled={
            !address || !recipient || !amount || isTransferLoading || !canTransfer || !tokenPair.wrappedAddress || !decryptionStatus.canDecrypt
          }
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium hover:opacity-90 active:scale-95 active:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
            isInitiating ? 'scale-95 opacity-75' : ''
          }`}
          title={
            !decryptionStatus.canDecrypt
              ? decryptionStatus.missingMessage || 'System requirements not met'
              : 'Send confidential transfer'
          }
        >
          {!isFHEReady && !fheError
            ? 'Initializing FHE...'
            : isInitiating
            ? 'Preparing Transaction...'
            : isTransferLoading
            ? 'Processing Transfer...'
            : 'Send Confidential Transfer'}
        </button>

        {!isFHEReady && !fheError && (
          <p className="text-center text-sm text-blue-600 dark:text-blue-400">
            Initializing FHE encryption... Please wait.
          </p>
        )}

        {fheError && (
          <div className="flex items-center justify-center gap-2 text-center text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>FHE Error: {fheError}</span>
          </div>
        )}

        {transferError && (
          <div className="flex items-center justify-center gap-2 text-center text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{transferError}</span>
          </div>
        )}

        {isConfirmed && (
          <div className="flex items-center justify-center gap-2 text-center text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span>Transfer completed successfully!</span>
            {txHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                View transaction
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
