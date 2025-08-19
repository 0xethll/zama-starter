// React hooks for token operations

import { useAccount, useReadContract } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'

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