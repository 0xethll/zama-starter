import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { useState, useEffect, useRef } from 'react'

import { useFHEContext } from '@/contexts/FHEContext'
import { decryptPublicly } from '@/lib/fhe'

/**
 * Hook to finalize unwrap requests
 * @param {Function} onSuccess - Callback to execute on successful finalization
 * @returns {Object} finalizeUnwrap function, loading state, success state, and error
 */
export function useFinalizeUnwrap(onSuccess?: () => void) {
    const {isFHEReady, fheInstance} = useFHEContext()

    // Track which transaction is currently pending
    const [pendingTx, setPendingTx] = useState<string | null>(null)

    const {
        data: hash,
        writeContract,
        isPending: isWritePending,
        error: writeError,
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess, isError: isConfirmError, error: confirmError } = useWaitForTransactionReceipt({
        hash,
    })

    // Execute callback on successful finalization or clear pending on error
    useEffect(() => {
        if (isSuccess) {
            setPendingTx(null)
            onSuccess?.()
        } else if (isConfirmError) {
            setPendingTx(null)
        }
    }, [isSuccess, isConfirmError, onSuccess])

    /**
     * Finalize an unwrap request by providing the decrypted amount and proof
     * @param {string} burntAmount - The encrypted amount handle (bytes32)
     * @param {string} tokenAddress - The wrapped token contract address
     * @param {bigint} cleartextAmount - The decrypted amount value
     * @param {string} proof - The decryption proof from FHEVM Gateway
     */
    const finalizeUnwrap: (
        burntAmount: `0x${string}`,
        tokenAddress: `0x${string}`
    ) => Promise<void> = async (burntAmount, tokenAddress) => {
        setPendingTx(burntAmount)

        if (!fheInstance) return
        const [cleartextAmount, proof] = await decryptPublicly(fheInstance, burntAmount)

        writeContract({
            address: tokenAddress,
            abi: CONTRACTS.cUSD_ERC7984.abi,
            functionName: 'finalizeUnwrap',
            args: [burntAmount, cleartextAmount, proof],
        })
    }

    return {
        finalizeUnwrap,
        isFinalizing: isWritePending || isConfirming,
        isSuccess,
        error: writeError?.message || confirmError?.message,
        hash,
        pendingTx,
    }
}
