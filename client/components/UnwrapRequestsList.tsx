'use client'

import { useUnwrapRequests } from '@/hooks/useUnwrapRequests'
import { useFinalizeUnwrap } from '@/hooks/useFinalizeUnwrap'
import { UnwrapRequestItem } from './UnwrapRequestItem'
import { Loader2, AlertCircle, ClipboardList } from 'lucide-react'

/**
 * Component that displays a list of pending unwrap requests
 * Fetches data from Envio indexer and allows users to finalize requests
 */
export function UnwrapRequestsList() {
    const { requests, isLoading, error, refetch } = useUnwrapRequests()

    const { finalizeUnwrap, isFinalizing, pendingTx } = useFinalizeUnwrap(() => {
        // Refetch requests after successful finalization
        refetch()
    })

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                    Loading unwrap requests...
                </span>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">
                    Error loading requests: {error}
                </span>
            </div>
        )
    }

    // Empty state
    if (requests.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                    No pending unwrap requests
                </p>
            </div>
        )
    }

    // List of requests
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                    Pending Unwrap Requests ({requests.length})
                </h3>
                <button
                    onClick={() => refetch()}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                    Refresh
                </button>
            </div>

            {requests.map((request) => (
                <UnwrapRequestItem
                    key={request.id}
                    request={request}
                    onFinalize={finalizeUnwrap}
                    isFinalizing={isFinalizing}
                    pendingTx={pendingTx}
                />
            ))}
        </div>
    )
}
