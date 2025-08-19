// React hooks for confidential token transfers

import { useState, useMemo, useEffect } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { useFHEReady } from './useFHE'
import { encryptUint64 } from '@/lib/fhe'
import { toHex, isAddress } from 'viem'

/**
 * Hook to transfer confidential tokens
 */
export function useTransferContract() {
  const { address, isConnected } = useAccount()
  const { isReady: isFHEReady, fheInstance } = useFHEReady()
  const [isPreparingTx, setIsPreparingTx] = useState(false)
  const [isInitiating, setIsInitiating] = useState(false)

  // Contract write hook
  const {
    writeContract: transferTokens,
    data: txHash,
    isPending: isWriting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract()

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const transfer = async (recipient: string, amount: number) => {
    setIsInitiating(true)
    
    try {
      if (!isConnected) {
        throw new Error('Please connect your wallet first')
      }

      if (!address) {
        throw new Error('No wallet address found')
      }

      if (!isFHEReady || !fheInstance) {
        throw new Error(
          'FHE system is not ready. Please wait for initialization.',
        )
      }

      if (!recipient || !isAddress(recipient)) {
        throw new Error('Please enter a valid recipient address')
      }

      if (!amount || amount <= 0) {
        throw new Error('Please enter a valid amount')
      }

      setIsPreparingTx(true)
      resetWrite()

      // Encrypt the transfer amount
      const { handle, proof } = await encryptUint64(
        fheInstance,
        CONTRACTS.FAUCET_TOKEN.address,
        address,
        BigInt(amount * 1000000),
      )

      // Call the transfer function
      transferTokens({
        address: CONTRACTS.FAUCET_TOKEN.address,
        abi: CONTRACTS.FAUCET_TOKEN.abi,
        functionName: 'confidentialTransfer',
        args: [recipient, toHex(handle), toHex(proof)],
      })
    } catch (error) {
      console.error('Error preparing transfer transaction:', error)
      setIsInitiating(false)
      setIsPreparingTx(false)
      throw error
    }
  }

  // Parse contract errors for user-friendly messages
  const errorMessage = useMemo(() => {
    const error = writeError || confirmError
    if (!error) return null

    const errorStr = error.toString()

    if (errorStr.includes('InsufficientBalance')) {
      return 'Insufficient balance to complete this transfer.'
    }

    if (errorStr.includes('rejected')) {
      return 'Transaction was rejected by user.'
    }

    if (errorStr.includes('insufficient funds')) {
      return 'Insufficient funds to pay for gas fees.'
    }

    if (errorStr.includes('InvalidProof')) {
      return 'Invalid encryption proof. Please try again.'
    }

    return 'Transaction failed. Please try again.'
  }, [writeError, confirmError])

  // Reset initiating state when transaction starts or completes
  useEffect(() => {
    if (isWriting || isConfirmed || errorMessage) {
      setIsInitiating(false)
      setIsPreparingTx(false)
    }
  }, [isWriting, isConfirmed, errorMessage])

  return {
    transfer,
    isLoading: isInitiating || isPreparingTx || isWriting || isConfirming,
    isInitiating,
    isPreparingTx,
    isWriting,
    isConfirming,
    isConfirmed,
    txHash,
    error: errorMessage,
    canTransfer:
      isConnected &&
      isFHEReady &&
      !isInitiating &&
      !isPreparingTx &&
      !isWriting &&
      !isConfirming,
  }
}
