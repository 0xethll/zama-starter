'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useAccount } from 'wagmi'
import { Signer } from 'ethers'
import { getEthersSigner } from '@/lib/client-to-signer'
import { useFHEReady } from '@/hooks/useFHE'
import { useConfidentialBalance } from '@/hooks/useFaucetContract'
import { useConfig } from 'wagmi'
import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'

interface FHEContextType {
  // FHE state
  isFHEReady: boolean
  fheInstance: FhevmInstance | null

  // Signer state
  signer: Signer | null

  // Balance state
  encryptedBalance: `0x${string}` | undefined
  decryptedBalance: bigint | null
  isBalanceVisible: boolean
  
  // Balance actions
  setDecryptedBalance: (balance: bigint | null) => void
  setIsBalanceVisible: (visible: boolean) => void

  // Progress tracking
  progress: {
    steps: Array<{
      key: string
      label: string
      complete: boolean
    }>
    completedCount: number
    totalCount: number
    currentStep: { key: string; label: string; complete: boolean } | undefined
    isComplete: boolean
  }
}

const FHEContext = createContext<FHEContextType | null>(null)

interface FHEProviderProps {
  children: ReactNode
}

export function FHEProvider({ children }: FHEProviderProps) {
  const { address, connector, isConnected } = useAccount()
  const config = useConfig()
  const { isReady: isFHEReady, fheInstance } = useFHEReady()
  const { encryptedBalance } = useConfidentialBalance()

  const [signer, setSigner] = useState<Signer | null>(null)
  const [decryptedBalance, setDecryptedBalance] = useState<bigint | null>(null)
  const [isBalanceVisible, setIsBalanceVisible] = useState(false)

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
  }, [address])

  // Clear decrypted balance when encrypted balance changes (after faucet/transfer)
  useEffect(() => {
    if (isBalanceVisible) {
      setDecryptedBalance(null)
      setIsBalanceVisible(false)
    }
  }, [encryptedBalance])

  // Calculate progress state
  const progress = React.useMemo(() => {
    const steps = [
      { key: 'wallet', label: 'Connect wallet', complete: !!address },
      {
        key: 'connector',
        label: 'Initialize connector',
        complete: !!connector,
      },
      {
        key: 'fhe',
        label: 'Load FHE system',
        complete: isFHEReady && !!fheInstance,
      },
      { key: 'signer', label: 'Initialize signer', complete: !!signer },
      { key: 'balance', label: 'Load balance', complete: !!encryptedBalance },
    ]

    const completedCount = steps.filter((step) => step.complete).length
    const currentStep = steps.find((step) => !step.complete)

    return {
      steps,
      completedCount,
      totalCount: steps.length,
      currentStep,
      isComplete: completedCount === steps.length,
    }
  }, [address, connector, isFHEReady, fheInstance, signer, encryptedBalance])

  const contextValue: FHEContextType = {
    isFHEReady,
    fheInstance,
    signer,
    encryptedBalance,
    decryptedBalance,
    isBalanceVisible,
    setDecryptedBalance,
    setIsBalanceVisible,
    progress,
  }

  return (
    <FHEContext.Provider value={contextValue}>{children}</FHEContext.Provider>
  )
}

export function useFHEContext() {
  const context = useContext(FHEContext)
  if (!context) {
    throw new Error('useFHEContext must be used within a FHEProvider')
  }
  return context
}
