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

/**
 * Hook to get USD ERC20 balance
 */
export function useUsdBalance() {
    const { address } = useAccount()

    const { data: balance, refetch } = useReadContract({
        address: CONTRACTS.USD_ERC20.address,
        abi: CONTRACTS.USD_ERC20.abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    })

    return {
        balance,
        refetch,
    }
}

/**
 * Hook to get wrapped token confidential balance (returns encrypted handle)
 */
export function useWrappedTokenBalance() {
    const { address } = useAccount()

    const { data: encryptedBalance, refetch } = useReadContract({
        address: CONTRACTS.WRAPPER_TOKEN.address,
        abi: CONTRACTS.WRAPPER_TOKEN.abi,
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
