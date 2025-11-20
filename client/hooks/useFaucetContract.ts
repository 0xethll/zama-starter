// React hooks for interacting with the cUSDToken contract

import { useState, useMemo, useEffect } from 'react'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { CONTRACTS, MINT_AMOUNT } from '@/lib/contracts'
import { useFHEContext } from '@/contexts/FHEContext'
import { encryptUint64 } from '@/lib/fhe'
import { toHex } from 'viem'
import { useCUSDBalance, useUsdBalance } from './useTokenContract'


/**
 * Hook to read cUSD contract data
 */
export function cUSDData() {
  const { address } = useAccount()

  // Read max mint amount
  const { data: maxMintAmount } = useReadContract({
    address: CONTRACTS.cUSD_ERC7984.address,
    abi: CONTRACTS.cUSD_ERC7984.abi,
    functionName: 'MAX_MINT_AMOUNT',
  })

  return {
    maxMintAmount,
  }
}

/**
 * Hook to mint tokens from the cUSD
 */
export function cUSDMint() {
  const { address, isConnected } = useAccount()
  const { isFHEReady, fheInstance } = useFHEContext()
  const { refetch: refetchBalance } = useCUSDBalance()
  const [isPreparingTx, setIsPreparingTx] = useState(false)
  const [isInitiating, setIsInitiating] = useState(false)

  // Contract write hook
  const {
    writeContract: mintTokens,
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

  const mintcUSD = async (amount?: bigint) => {
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

      setIsPreparingTx(true)
      resetWrite()

      // Encrypt the mint amount
      const { handle, proof } = await encryptUint64(
        fheInstance,
        CONTRACTS.cUSD_ERC7984.address,
        address,
        amount ?? MINT_AMOUNT,
      )

      // Call the mint function
      mintTokens({
        address: CONTRACTS.cUSD_ERC7984.address,
        abi: CONTRACTS.cUSD_ERC7984.abi,
        functionName: 'mint',
        args: [address, toHex(handle), toHex(proof)],
      })
    } catch (error) {
      console.error('Error preparing mint transaction:', error)
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

    if (errorStr.includes('MintCooldownActive')) {
      return 'Cooldown period is still active. Please wait 24 hours between claims.'
    }

    if (errorStr.includes('rejected')) {
      return 'Transaction was rejected by user.'
    }

    if (errorStr.includes('insufficient funds')) {
      return 'Insufficient funds to pay for gas fees.'
    }

    return 'Transaction failed. Please try again.'
  }, [writeError, confirmError])

  // Refetch data after successful confirmation
  useEffect(() => {
    if (isConfirmed) {
      refetchBalance()
    }
  }, [isConfirmed, refetchBalance])

  // Reset initiating state when transaction starts or completes
  useEffect(() => {
    if (isWriting || isConfirmed || errorMessage) {
      setIsInitiating(false)
      setIsPreparingTx(false)
    }
  }, [isWriting, isConfirmed, errorMessage])

  return {
    mintcUSD,
    isLoading: isInitiating || isPreparingTx || isWriting || isConfirming,
    isInitiating,
    isPreparingTx,
    isWriting,
    isConfirming,
    isConfirmed,
    txHash,
    error: errorMessage,
    canMint:
      isConnected &&
      isFHEReady &&
      !isInitiating &&
      !isPreparingTx &&
      !isWriting &&
      !isConfirming,
  }
}

