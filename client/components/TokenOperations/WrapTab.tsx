// Wrap Tab Component with Auto Wrapper Creation

'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import {
  useAllowance,
  useApproval,
  useWrap,
} from '@/hooks/useWrapUnwrap'
import { useConfidentialBalance } from '@/contexts/ConfidentialBalanceContext'
import { formatErrorMessage } from '@/lib/utils'
import { useCreateWrappedToken } from '@/hooks/useFactoryContract'
import { WrapProgressIndicator, type WrapStep } from '../WrapProgressIndicator'
import type { TabComponentProps } from './types'

export function WrapTab({
  tokenPair,
  onComplete,
}: TabComponentProps) {
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

  const { allowance, refetchAllowance } = useAllowance(
    tokenPair.erc20Address,
    tokenPair.wrappedAddress || undefined,
  )
  const {
    approveTokens,
    isLoading: isApproving,
    isConfirmed: isApprovalConfirmed,
    error: approvalError,
  } = useApproval(
    tokenPair.erc20Address,
    tokenPair.wrappedAddress || undefined,
    tokenPair.erc20Decimals,
  )

  const {
    wrapTokens,
    isLoading: isWrapping,
    isConfirmed: isWrapConfirmed,
    error: wrapError,
    reset: resetWrap,
  } = useWrap(tokenPair.wrappedAddress || undefined, tokenPair.erc20Decimals)

  // Reset state when token pair changes
  useEffect(() => {
    setWrapAmount('')
    setCurrentStep(null)
    setCompletedSteps([])
    resetWrap()
    wrapperCreatedContinuedRef.current = false
    approvalCompletedRef.current = false
  }, [tokenPair.erc20Address, resetWrap])

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
      !wrapperCreatedContinuedRef.current // Prevent duplicate execution
    ) {
      wrapperCreatedContinuedRef.current = true
      console.log('✅ Wrapper created, auto-continuing to next step...')

      // Check if approval is needed
      const wrapAmountWei = parseUnits(wrapAmount, tokenPair.erc20Decimals)
      const hasInsufficientAllowance =
        allowance !== undefined && wrapAmountWei > allowance

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
    allowance, // Added
    approveTokens, // Added
    tokenPair.erc20Decimals, // Added
    wrapTokens, // Added
  ])

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
  }, [
    isApprovalConfirmed,
    completedSteps,
    isWrapping,
    currentStep,
    refetchAllowance,
    wrapAmount,
    wrapTokens,
  ]) // Remove function dependencies

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
    }
  }, [approvalError])

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
        allowance !== undefined && wrapAmountWei > allowance
      if (hasInsufficientAllowance) {
        setCurrentStep('approve')
        await approveTokens(wrapAmount)
        return // Wait for approval to complete
      }

      // Step 3: Wrap
      setCurrentStep('wrap')
      await wrapTokens(wrapAmount)
    } catch (error) {
      console.error('Wrap action error:', error)
      setCurrentStep(null)
    }
  }

  const maxWrapAmount = formatUnits(
    tokenPair.erc20Balance,
    tokenPair.erc20Decimals,
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
            <span>
              {formatErrorMessage(wrapperError || approvalError || wrapError)}
            </span>
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
