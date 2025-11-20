'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { decryptForUser, formatTokenAmount } from '@/lib/fhe'
import { CONTRACTS } from '@/lib/contracts'
import { Coins, Eye, EyeOff, Loader2, DollarSign, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFHEContext } from '@/contexts/FHEContext'
import { useUsdBalance } from '@/hooks/useTokenContract'
import { formatUnits } from 'viem'

export function TokenBalance() {
    const { address, connector } = useAccount()
    const {
        isFHEReady,
        fheInstance,
        fheError,
        retryFHE,
        signer,
        encryptedBalance,
        decryptedBalance,
        isBalanceVisible,
        setDecryptedBalance,
        setIsBalanceVisible,
    } = useFHEContext()

    const [isDecrypting, setIsDecrypting] = useState(false)
    const [decryptError, setDecryptError] = useState<string | null>(null)

    // USD balance
    const { balance: usdBalance } = useUsdBalance()

    // Calculate progress state locally (moved from FHEContext for performance)
    const progress = useMemo(() => {
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
            {
                key: 'balance',
                label: 'Load balance',
                complete: !!encryptedBalance,
            },
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

    // Clear decrypt error when address changes
    useEffect(() => {
        setDecryptError(null)
    }, [address])

    // Clear decrypt error when encrypted balance changes
    useEffect(() => {
        if (decryptError) {
            setDecryptError(null)
        }
    }, [encryptedBalance])

    const decryptBalance = useCallback(async () => {
        if (
            !address ||
            !encryptedBalance ||
            !isFHEReady ||
            !fheInstance ||
            !signer
        ) {
            return
        }

        setIsDecrypting(true)
        setDecryptError(null)

        try {
            let balance
            if (
                encryptedBalance ==
                '0x0000000000000000000000000000000000000000000000000000000000000000'
            ) {
                balance = BigInt(0)
            } else {
                balance = await decryptForUser(
                    fheInstance,
                    encryptedBalance as string,
                    CONTRACTS.cUSD_ERC7984.address,
                    signer,
                )
            }

            setDecryptedBalance(balance)
            setIsBalanceVisible(true)
        } catch (error) {
            console.error('Error decrypting balance:', error)
            setDecryptError('Failed to decrypt balance. Please try again.')
        } finally {
            setIsDecrypting(false)
        }
    }, [address, encryptedBalance, isFHEReady, fheInstance, signer])

    const toggleBalanceVisibility = () => {
        if (isBalanceVisible) {
            setIsBalanceVisible(false)
            setDecryptedBalance(null)
        } else {
            decryptBalance()
        }
    }

    // Don't show if not connected
    if (!address) {
        return null
    }
    const canDecrypt = progress.isComplete

    return (
        <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Token Balances
            </div>

            {/* Confidential USD Balance */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-green-500" />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Confidential USD
                        </span>
                        <span className="text-sm font-medium">
                            {isBalanceVisible && decryptedBalance !== null
                                ? formatTokenAmount(decryptedBalance)
                                : '******'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={toggleBalanceVisibility}
                    disabled={isDecrypting || !canDecrypt}
                    className={cn(
                        'p-1.5 rounded-md transition-colors',
                        'hover:bg-gray-100 dark:hover:bg-gray-700',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                    )}
                    title={
                        isBalanceVisible
                            ? 'Hide balance'
                            : progress.currentStep?.label || 'Show balance'
                    }
                >
                    {isDecrypting ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    ) : isBalanceVisible ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                    )}
                </button>
            </div>

            {/* USD Token Balance */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            USD Token
                        </span>
                        <span className="text-sm font-medium">
                            {usdBalance ? formatUnits(usdBalance, 6) : '0'} USD
                        </span>
                    </div>
                </div>
            </div>

            {decryptError && (
                <div className="text-xs text-red-500 dark:text-red-400">
                    {decryptError}
                </div>
            )}

            {fheError && (
                <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">FHE Initialization Failed</span>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300">
                        {fheError}
                    </p>
                    <button
                        onClick={retryFHE}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition-colors"
                    >
                        Retry Initialization
                    </button>
                </div>
            )}

            {!canDecrypt && !isDecrypting && !fheError && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                            Initializing ({progress.completedCount}/
                            {progress.totalCount})
                        </span>
                        <span className="text-gray-500">
                            {Math.round(
                                (progress.completedCount /
                                    progress.totalCount) *
                                    100,
                            )}
                            %
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                            style={{
                                width: `${
                                    (progress.completedCount /
                                        progress.totalCount) *
                                    100
                                }%`,
                            }}
                        />
                    </div>

                    {progress.currentStep && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>{progress.currentStep.label}...</span>
                        </div>
                    )}

                    <div className="space-y-1">
                        {progress.steps.map((step) => (
                            <div
                                key={step.key}
                                className="flex items-center gap-2 text-xs"
                            >
                                <div
                                    className={cn(
                                        'w-1.5 h-1.5 rounded-full transition-colors',
                                        step.complete
                                            ? 'bg-green-500'
                                            : step === progress.currentStep
                                            ? 'bg-amber-500 animate-pulse'
                                            : 'bg-gray-300 dark:bg-gray-600',
                                    )}
                                />
                                <span
                                    className={cn(
                                        'transition-colors',
                                        step.complete
                                            ? 'text-green-600 dark:text-green-400'
                                            : step === progress.currentStep
                                            ? 'text-amber-600 dark:text-amber-400'
                                            : 'text-gray-500 dark:text-gray-400',
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
