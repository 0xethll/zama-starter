'use client'

import { formatUnits } from 'viem'
import { Loader2, CheckCircle, Clock } from 'lucide-react'
import { UnwrapRequest } from '@/hooks/useUnwrapRequests'

interface UnwrapRequestItemProps {
    request: UnwrapRequest
    onFinalize: (
        burntAmount: `0x${string}`,
        cleartextAmount: bigint,
        proof: `0x${string}`,
    ) => void
    isFinalizing: boolean
    pendingTx: string | null
}

/**
 * Component to display a single unwrap request
 * Shows request details and provides a finalize button when ready
 */
export function UnwrapRequestItem({
    request,
    onFinalize,
    isFinalizing,
    pendingTx,
}: UnwrapRequestItemProps) {
    const isThisPending = pendingTx === request.burntAmount
    const canFinalize = request.cleartextAmount && !request.isFinalized

    const handleFinalize = () => {
        if (!canFinalize) return

        // TODO: Integrate with FHEVM Gateway to get the actual decryption proof
        // For now, this is a placeholder that will fail if the proof is invalid
        // You need to implement the gateway integration to retrieve:
        // 1. The decrypted cleartext amount (already available from indexer)
        // 2. The cryptographic proof that verifies the decryption is correct
        const proof = '0x' as `0x${string}`

        onFinalize(
            request.burntAmount as `0x${string}`,
            BigInt(request.cleartextAmount!),
            proof,
        )
    }

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                    {/* Request ID */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Request ID:
                        </span>
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {request.burntAmount.slice(0, 10)}...
                            {request.burntAmount.slice(-8)}
                        </code>
                    </div>

                    {/* Amount (if decrypted) */}
                    {request.cleartextAmount && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Amount:
                            </span>
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {formatUnits(BigInt(request.cleartextAmount), 6)}{' '}
                                USD
                            </span>
                        </div>
                    )}

                    {/* Block and timestamp info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Block: #{request.requestBlockNumber}</span>
                        <span>
                            {new Date(
                                Number(request.requestTimestamp) * 1000,
                            ).toLocaleString()}
                        </span>
                    </div>

                    {/* Etherscan link */}
                    <a
                        href={`https://sepolia.etherscan.io/tx/${request.requestTransactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-block"
                    >
                        View on Etherscan ↗
                    </a>
                </div>

                {/* Action button */}
                <div className="ml-4">
                    {request.cleartextAmount ? (
                        <button
                            onClick={handleFinalize}
                            disabled={isFinalizing || !canFinalize}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                        >
                            {isThisPending && isFinalizing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Finalizing...
                                </>
                            ) : request.isFinalized ? (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    Finalized
                                </>
                            ) : (
                                'Finalize'
                            )}
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                            <Clock className="h-4 w-4 animate-pulse" />
                            Decrypting...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
