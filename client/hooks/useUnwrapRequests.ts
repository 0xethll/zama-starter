import { useAccount } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'
import { graphqlClient } from '@/lib/graphql-client'

/**
 * GraphQL query to fetch unwrap requests for a specific recipient
 * Note: Envio/Hasura uses camelCase field names
 */
const UNWRAP_REQUESTS_QUERY = `
  query UnwrapRequests($recipient: String!, $isFinalized: Boolean!) {
    ConfidentialUSDX402_UnwrapRequest(
      where: {
        recipient: { _eq: $recipient }
        isFinalized: { _eq: $isFinalized }
      }
      order_by: { requestTimestamp: desc }
    ) {
      id
      burntAmount
      recipient
      requestBlockNumber
      requestTransactionHash
      requestTimestamp
      isFinalized
      cleartextAmount
      finalizedBlockNumber
      finalizedTransactionHash
      finalizedTimestamp
    }
  }
`

/**
 * Unwrap request entity from Envio indexer
 */
export interface UnwrapRequest {
    id: string
    burntAmount: string
    recipient: string
    requestBlockNumber: string
    requestTransactionHash: string
    requestTimestamp: string
    isFinalized: boolean
    cleartextAmount?: string
    finalizedBlockNumber?: string
    finalizedTransactionHash?: string
    finalizedTimestamp?: string
}

/**
 * Hook to fetch unwrap requests for the connected wallet
 * @returns {Object} requests, loading state, error, and refetch function
 */
export function useUnwrapRequests() {
    const { address } = useAccount()
    const [requests, setRequests] = useState<UnwrapRequest[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | undefined>()

    const fetchRequests = useCallback(async () => {
        if (!address) {
            setRequests([])
            return
        }

        setIsLoading(true)
        setError(undefined)

        try {
            const data = await graphqlClient.request<{
                ConfidentialUSDX402_UnwrapRequest: UnwrapRequest[]
            }>(UNWRAP_REQUESTS_QUERY, {
                recipient: address,
                isFinalized: false,
            })

            setRequests(data.ConfidentialUSDX402_UnwrapRequest || [])
        } catch (err: any) {
            console.error('GraphQL Error:', err)
            setError(err.message || 'Failed to fetch unwrap requests')
        } finally {
            setIsLoading(false)
        }
    }, [address])

    useEffect(() => {
        fetchRequests()
    }, [fetchRequests])

    return {
        requests,
        isLoading,
        error,
        refetch: fetchRequests,
    }
}
