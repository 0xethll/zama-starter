// React hooks for wrap/unwrap operations

import { useState, useEffect } from 'react'
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
    useReadContract,
} from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { parseUnits } from 'viem'

import { useUsdBalance, useCUSDBalance } from './useTokenContract'

/**
 * Hook to check USD token allowance for wrapper contract
 */
export function useUsdAllowance() {
    const { address } = useAccount()

    const { data: allowance, refetch } = useReadContract({
        address: CONTRACTS.USD_ERC20.address,
        abi: CONTRACTS.USD_ERC20.abi,
        functionName: 'allowance',
        args: address ? [address, CONTRACTS.cUSD_ERC7984.address] : undefined,
        query: {
            enabled: !!address,
        },
    })

    return {
        allowance,
        refetchAllowance: refetch,
    }
}

/**
 * Hook to approve USD tokens for wrapper contract
 */
export function useUsdApproval() {
    const [isApproving, setIsApproving] = useState(false)
    const [approvalError, setApprovalError] = useState<string | null>(null)

    const { writeContract, data: hash, reset } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed, error } =
        useWaitForTransactionReceipt({
            hash,
        })

    const approveTokens = async (amount: string) => {
        try {
            setIsApproving(true)
            setApprovalError(null)
            reset() // Reset any previous errors

            const amountWei = parseUnits(amount, 6) // USD token has 6 decimals

            writeContract({
                address: CONTRACTS.USD_ERC20.address,
                abi: CONTRACTS.USD_ERC20.abi,
                functionName: 'approve',
                args: [CONTRACTS.cUSD_ERC7984.address, amountWei],
            })
        } catch (err) {
            console.error('Approval error:', err)
            setApprovalError(
                err instanceof Error ? err.message : 'Failed to approve tokens',
            )
            setIsApproving(false)
        }
    }

    // Reset approving state when transaction completes
    useEffect(() => {
        if (isConfirmed) {
            setIsApproving(false)
        }
    }, [isConfirmed])

    // Handle errors
    useEffect(() => {
        if (error) {
            setIsApproving(false)
            setApprovalError(error.message || 'Failed to approve tokens')
        }
    }, [error])

    const resetApproval = () => {
        setApprovalError(null)
        setIsApproving(false)
        reset()
    }

    return {
        approveTokens,
        isApproving: isApproving || isConfirming,
        isConfirmed,
        approvalError: approvalError || error?.message || null,
        hash,
        resetApproval,
    }
}

/**
 * Hook for wrapping USD tokens to wrapped Confidential USDs
 */
export function useWrapToken() {
    const { address } = useAccount()
    const [isWrapping, setIsWrapping] = useState(false)
    const [wrapError, setWrapError] = useState<string | null>(null)

    const { writeContract, data: hash, reset } = useWriteContract()

    const { refetch: refetchUsdBalance } = useUsdBalance()
    const { refetch: refetchCUSDBalance } = useCUSDBalance()

    const { isLoading: isConfirming, isSuccess: isConfirmed, error } =
        useWaitForTransactionReceipt({
            hash,
        })

    const wrapTokens = async (amount: string) => {
        if (!address || !amount) return

        try {
            setIsWrapping(true)
            setWrapError(null)
            reset() // Reset any previous errors

            const amountWei = parseUnits(amount, 6) // USD token has 6 decimals

            writeContract({
                address: CONTRACTS.cUSD_ERC7984.address,
                abi: CONTRACTS.cUSD_ERC7984.abi,
                functionName: 'wrap',
                args: [address, amountWei],
            })
        } catch (err) {
            console.error('Wrap error:', err)
            setWrapError(
                err instanceof Error ? err.message : 'Failed to wrap tokens',
            )
            setIsWrapping(false)
        }
    }

    // Reset wrapping state when transaction completes or fails
    useEffect(() => {
        if (isConfirmed) {
            setIsWrapping(false)
            refetchUsdBalance()
            refetchCUSDBalance()
        }
    }, [isConfirmed, refetchUsdBalance, refetchCUSDBalance])

    // Handle errors
    useEffect(() => {
        if (error) {
            setIsWrapping(false)
            setWrapError(error.message || 'Failed to wrap tokens')
        }
    }, [error])

    const resetWrap = () => {
        setWrapError(null)
        setIsWrapping(false)
        reset()
    }

    return {
        wrapTokens,
        isWrapping: isWrapping || isConfirming,
        isConfirmed,
        wrapError: wrapError || error?.message || null,
        hash,
        resetWrap,
    }
}

/**
 * Hook for unwrapping Confidential USDs back to USD tokens
 */
export function useUnwrapToken() {
    const { address } = useAccount()
    const [isUnwrapping, setIsUnwrapping] = useState(false)
    const [unwrapError, setUnwrapError] = useState<string | null>(null)

    const { writeContract, data: hash, reset } = useWriteContract()

    const { refetch: refetchUsdBalance } = useUsdBalance()
    const { refetch: refetchCUSDBalance } = useCUSDBalance()

    const { isLoading: isConfirming, isSuccess: isConfirmed, error } =
        useWaitForTransactionReceipt({
            hash,
        })

    const unwrapTokens = async (
        encryptedAmount: `0x${string}`,
        inputProof: `0x${string}`,
    ) => {
        if (!address || !encryptedAmount || !inputProof) return

        try {
            setIsUnwrapping(true)
            setUnwrapError(null)
            reset() // Reset any previous errors

            writeContract({
                address: CONTRACTS.cUSD_ERC7984.address,
                abi: CONTRACTS.cUSD_ERC7984.abi,
                functionName: 'unwrap',
                args: [address, address, encryptedAmount, inputProof],
            })
        } catch (err) {
            console.error('Unwrap error:', err)
            setUnwrapError(
                err instanceof Error ? err.message : 'Failed to unwrap tokens',
            )
            setIsUnwrapping(false)
        }
    }

    // Reset unwrapping state when transaction completes
    useEffect(() => {
        if (isConfirmed) {
            setIsUnwrapping(false)
            refetchCUSDBalance()
            refetchUsdBalance()
        }
    }, [isConfirmed, refetchCUSDBalance, refetchUsdBalance])

    // Handle errors
    useEffect(() => {
        if (error) {
            setIsUnwrapping(false)
            setUnwrapError(error.message || 'Failed to unwrap tokens')
        }
    }, [error])

    const resetUnwrap = () => {
        setUnwrapError(null)
        setIsUnwrapping(false)
        reset()
    }

    return {
        unwrapTokens,
        isUnwrapping: isUnwrapping || isConfirming,
        isConfirmed,
        unwrapError: unwrapError || error?.message || null,
        hash,
        resetUnwrap,
    }
}
