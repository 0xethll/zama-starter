import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { useState, useEffect } from 'react'

/**
 * Hook to finalize unwrap requests
 * @param {Function} onSuccess - Callback function to execute after successful finalization
 * @returns {Object} finalizeUnwrap function, loading state, success state, and error
 */
export function useFinalizeUnwrap(onSuccess?: () => void) {
    // Track which transaction is currently pending
    const [pendingTx, setPendingTx] = useState<string | null>(null)

    const {
        data: hash,
        writeContract,
        isPending: isWritePending,
        error: writeError,
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    // Execute callback on successful finalization
    useEffect(() => {
        if (isSuccess && onSuccess) {
            onSuccess()
            setPendingTx(null)
        }
    }, [isSuccess, onSuccess])

    /**
     * Finalize an unwrap request by providing the decrypted amount and proof
     * @param {string} burntAmount - The encrypted amount handle (bytes32)
     * @param {bigint} cleartextAmount - The decrypted amount value
     * @param {string} proof - The decryption proof from FHEVM Gateway
     */
    const finalizeUnwrap = async (
        burntAmount: `0x${string}`,
        cleartextAmount: bigint,
        proof: `0x${string}`,
    ) => {
        setPendingTx(burntAmount)
        writeContract({
            address: CONTRACTS.cUSD_ERC7984.address,
            abi: CONTRACTS.cUSD_ERC7984.abi,
            functionName: 'finalizeUnwrap',
            args: [burntAmount, cleartextAmount, proof],
        })
    }

    return {
        finalizeUnwrap,
        isFinalizing: isWritePending || isConfirming,
        isSuccess,
        error: writeError?.message,
        hash,
        pendingTx,
    }
}
