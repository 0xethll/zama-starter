// React hooks for interacting with the FaucetToken contract

import { useState, useMemo, useEffect } from 'react'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { CONTRACTS, MINT_AMOUNT } from '@/lib/contracts'
import { useFHEReady } from './useFHE'
import { encryptUint64 } from '@/lib/fhe'
import { toHex } from 'viem'

/**
 * Hook to read faucet contract data
 */
export function useFaucetData() {
  const { address } = useAccount()

  // Read last mint time for current user
  const { data: lastMintTime, refetch: refetchLastMintTime } = useReadContract({
    address: CONTRACTS.FAUCET_TOKEN.address,
    abi: CONTRACTS.FAUCET_TOKEN.abi,
    functionName: 'getLastMintTime',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Read mint cooldown period
  const { data: mintCooldown } = useReadContract({
    address: CONTRACTS.FAUCET_TOKEN.address,
    abi: CONTRACTS.FAUCET_TOKEN.abi,
    functionName: 'MINT_COOLDOWN',
  })

  // Read max mint amount
  const { data: maxMintAmount } = useReadContract({
    address: CONTRACTS.FAUCET_TOKEN.address,
    abi: CONTRACTS.FAUCET_TOKEN.abi,
    functionName: 'MAX_MINT_AMOUNT',
  })

  // Calculate if user can claim
  const canClaim = useMemo(() => {
    if (!lastMintTime || !mintCooldown) return true
    const lastMintTimeMs = Number(lastMintTime) * 1000
    const cooldownMs = Number(mintCooldown) * 1000
    return lastMintTimeMs === 0 || Date.now() - lastMintTimeMs > cooldownMs
  }, [lastMintTime, mintCooldown])

  // Calculate time until next claim
  const timeUntilNextClaim = useMemo(() => {
    if (!lastMintTime || !mintCooldown || canClaim) return 0
    const lastMintTimeMs = Number(lastMintTime) * 1000
    const cooldownMs = Number(mintCooldown) * 1000
    const nextClaimTime = lastMintTimeMs + cooldownMs
    return Math.max(0, nextClaimTime - Date.now())
  }, [lastMintTime, mintCooldown, canClaim])

  // Format last claim date
  const lastClaimDate = useMemo(() => {
    if (!lastMintTime || Number(lastMintTime) === 0) return null
    return new Date(Number(lastMintTime) * 1000)
  }, [lastMintTime])

  return {
    lastMintTime,
    mintCooldown,
    maxMintAmount,
    canClaim,
    timeUntilNextClaim,
    lastClaimDate,
    refetchLastMintTime,
  }
}

/**
 * Hook to mint tokens from the faucet
 */
export function useFaucetMint() {
  const { address, isConnected } = useAccount()
  const { isReady: isFHEReady, fheInstance } = useFHEReady()
  const { refetchLastMintTime } = useFaucetData()
  const [isPreparingTx, setIsPreparingTx] = useState(false)

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

  const mintFaucetTokens = async () => {
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

    try {
      // Encrypt the mint amount
      const { handle, proof } = await encryptUint64(
        fheInstance,
        CONTRACTS.FAUCET_TOKEN.address,
        address,
        MINT_AMOUNT,
      )

      // Call the mint function
      mintTokens({
        address: CONTRACTS.FAUCET_TOKEN.address,
        abi: CONTRACTS.FAUCET_TOKEN.abi,
        functionName: 'mint',
        args: [address, toHex(handle), toHex(proof)],
      })
    } catch (error) {
      console.error('Error preparing mint transaction:', error)
      throw error
    } finally {
      setIsPreparingTx(false)
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
      refetchLastMintTime()
    }
  }, [isConfirmed, refetchLastMintTime])

  return {
    mintFaucetTokens,
    isLoading: isPreparingTx || isWriting || isConfirming,
    isPreparingTx,
    isWriting,
    isConfirming,
    isConfirmed,
    txHash,
    error: errorMessage,
    canMint:
      isConnected &&
      isFHEReady &&
      !isPreparingTx &&
      !isWriting &&
      !isConfirming,
  }
}

/**
 * Hook to get confidential balance (returns encrypted handle)
 */
export function useConfidentialBalance() {
  const { address } = useAccount()

  const { data: encryptedBalance, refetch } = useReadContract({
    address: CONTRACTS.FAUCET_TOKEN.address,
    abi: CONTRACTS.FAUCET_TOKEN.abi,
    functionName: 'confidentialBalanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return {
    encryptedBalance,
    refetch,
  }
}
