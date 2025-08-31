'use client'

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useRef,
    useCallback,
} from 'react'
import { useAccount } from 'wagmi'
import { Signer } from 'ethers'
import { getEthersSigner } from '@/lib/client-to-signer'
import { initializeFHE, createFHEInstance } from '@/lib/fhe'
import {
    useConfidentialBalance,
    useWrappedTokenBalance,
} from '@/hooks/useTokenContract'
import { useConfig } from 'wagmi'
import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'

// Global singleton state to prevent multiple FHE initializations
let globalFheInstance: FhevmInstance | null = null
let globalIsInitialized = false
let globalInitPromise: Promise<FhevmInstance> | null = null
let globalError: string | null = null

// Subscribers for state changes
type StateChangeListener = () => void
const stateChangeListeners = new Set<StateChangeListener>()

const notifyStateChange = () => {
    stateChangeListeners.forEach((listener) => listener())
}

/**
 * Initialize FHE singleton instance
 */
const initializeFHESingleton = async (): Promise<FhevmInstance> => {
    // Return existing instance if already initialized
    if (globalFheInstance && globalIsInitialized) {
        return globalFheInstance
    }

    // Return existing promise if initialization is in progress
    if (globalInitPromise) {
        return globalInitPromise
    }

    // Start new initialization
    globalInitPromise = (async () => {
        try {
            globalError = null

            // Check if ethereum provider is available
            if (typeof window === 'undefined' || !window.ethereum) {
                throw new Error(
                    'Ethereum provider not available. Please install MetaMask.',
                )
            }

            // Initialize SDK
            await initializeFHE()

            // Create instance
            const instance = await createFHEInstance()

            globalFheInstance = instance
            globalIsInitialized = true
            notifyStateChange()

            return instance
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to initialize FHE'
            globalError = errorMessage
            globalInitPromise = null
            console.error('FHE initialization error:', err)
            notifyStateChange()
            throw err
        }
    })()

    return globalInitPromise
}

interface FHEContextType {
    // FHE state
    isFHEReady: boolean
    fheInstance: FhevmInstance | null
    fheError: string | null
    retryFHE: () => void

    // Signer state
    signer: Signer | null

    // Balance state
    encryptedBalance: `0x${string}` | undefined
    decryptedBalance: bigint | null
    isBalanceVisible: boolean

    // Wrapped token balance state
    wrappedEncryptedBalance: `0x${string}` | undefined
    wrappedDecryptedBalance: bigint | null
    isWrappedBalanceVisible: boolean

    // Balance actions
    setDecryptedBalance: (balance: bigint | null) => void
    setIsBalanceVisible: (visible: boolean) => void
    setWrappedDecryptedBalance: (balance: bigint | null) => void
    setIsWrappedBalanceVisible: (visible: boolean) => void
}

const FHEContext = createContext<FHEContextType | null>(null)

interface FHEProviderProps {
    children: ReactNode
}

export function FHEProvider({ children }: FHEProviderProps) {
    const { address, connector, isConnected } = useAccount()
    const config = useConfig()
    const { encryptedBalance } = useConfidentialBalance()
    const { encryptedBalance: wrappedEncryptedBalance } =
        useWrappedTokenBalance()

    const [signer, setSigner] = useState<Signer | null>(null)
    const [decryptedBalance, setDecryptedBalance] = useState<bigint | null>(
        null,
    )
    const [isBalanceVisible, setIsBalanceVisible] = useState(false)
    const [wrappedDecryptedBalance, setWrappedDecryptedBalance] = useState<
        bigint | null
    >(null)
    const [isWrappedBalanceVisible, setIsWrappedBalanceVisible] =
        useState(false)
    const [fheError, setFheError] = useState<string | null>(globalError)
    const isMountedRef = useRef(true)

    // Update FHE error state when global state changes
    const updateFHEState = useCallback(() => {
        if (!isMountedRef.current) return
        setFheError(globalError)
    }, [])

    // Initialize FHE with singleton pattern
    useEffect(() => {
        isMountedRef.current = true

        // Subscribe to global FHE state changes
        stateChangeListeners.add(updateFHEState)

        // Initialize if not already done
        if (!globalIsInitialized && !globalInitPromise && !globalError) {
            initializeFHESingleton().catch(() => {
                // Error already handled in initializeFHESingleton
            })
        } else {
            updateFHEState()
        }

        return () => {
            isMountedRef.current = false
            stateChangeListeners.delete(updateFHEState)
        }
    }, [updateFHEState])

    const retryFHE = useCallback(() => {
        if (!isMountedRef.current) return

        // Reset global state
        globalFheInstance = null
        globalIsInitialized = false
        globalInitPromise = null
        globalError = null

        setFheError(null)

        initializeFHESingleton().catch(() => {
            // Error already handled in initializeFHESingleton
        })
    }, [])

    // Initialize signer when wallet is connected
    useEffect(() => {
        const initSigner = async () => {
            if (!isConnected || !address) {
                setSigner(null)
                return
            }

            try {
                const s = await getEthersSigner(config)
                if (!s) {
                    console.warn('Failed to initialize signer')
                    setSigner(null)
                    return
                }
                setSigner(s)
            } catch (error) {
                console.error('Error initializing signer:', error)
                setSigner(null)
            }
        }

        initSigner()
    }, [config, address, isConnected])

    // Clear decrypted balance when address changes (wallet switch)
    useEffect(() => {
        setDecryptedBalance(null)
        setIsBalanceVisible(false)
        setWrappedDecryptedBalance(null)
        setIsWrappedBalanceVisible(false)
    }, [address])

    // Clear decrypted balance when encrypted balance changes (after faucet/transfer)
    useEffect(() => {
        if (isBalanceVisible) {
            setDecryptedBalance(null)
            setIsBalanceVisible(false)
        }
    }, [encryptedBalance])

    // Clear wrapped decrypted balance when wrapped encrypted balance changes (after wrap/unwrap)
    useEffect(() => {
        if (isWrappedBalanceVisible) {
            setWrappedDecryptedBalance(null)
            setIsWrappedBalanceVisible(false)
        }
    }, [wrappedEncryptedBalance])

    const contextValue: FHEContextType = {
        isFHEReady: globalIsInitialized && !!globalFheInstance && !fheError,
        fheInstance: globalFheInstance,
        fheError,
        retryFHE,
        signer,
        encryptedBalance,
        decryptedBalance,
        isBalanceVisible,
        wrappedEncryptedBalance,
        wrappedDecryptedBalance,
        isWrappedBalanceVisible,
        setDecryptedBalance,
        setIsBalanceVisible,
        setWrappedDecryptedBalance,
        setIsWrappedBalanceVisible,
    }

    return (
        <FHEContext.Provider value={contextValue}>
            {children}
        </FHEContext.Provider>
    )
}

export function useFHEContext() {
    const context = useContext(FHEContext)
    if (!context) {
        throw new Error('useFHEContext must be used within a FHEProvider')
    }
    return context
}
