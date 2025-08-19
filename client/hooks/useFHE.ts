// React hooks for FHE functionality

import { useState, useEffect } from 'react'
import { initializeFHE, createFHEInstance } from '@/lib/fhe'
import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'

/**
 * Hook to manage FHE instance initialization
 * Automatically initializes the SDK and creates an instance when component mounts
 */
export function useFHE() {
  const [fheInstance, setFheInstance] = useState<FhevmInstance | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const initFHE = async () => {
      try {
        setError(null)
        setIsLoading(true)

        // Check if ethereum provider is available
        if (typeof window === 'undefined' || !window.ethereum) {
          throw new Error('Ethereum provider not available. Please install MetaMask.')
        }

        // Initialize SDK
        await initializeFHE()
        
        if (!isMounted) return

        // Create instance
        const instance = await createFHEInstance()
        
        if (!isMounted) return

        setFheInstance(instance)
        setIsInitialized(true)
      } catch (err) {
        if (!isMounted) return
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize FHE'
        setError(errorMessage)
        console.error('FHE initialization error:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initFHE()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    fheInstance,
    isInitialized,
    isLoading,
    error,
    // Helper to retry initialization
    retry: () => {
      setIsLoading(true)
      setError(null)
      // Trigger re-initialization by updating a dependency
      window.location.reload()
    }
  }
}

/**
 * Hook to check if FHE is ready for use
 */
export function useFHEReady() {
  const { fheInstance, isInitialized, isLoading, error } = useFHE()
  
  return {
    isReady: isInitialized && !!fheInstance && !isLoading && !error,
    fheInstance,
    isLoading,
    error
  }
}