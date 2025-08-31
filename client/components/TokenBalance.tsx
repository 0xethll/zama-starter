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
    } = useFHEContext()

    const [isDecrypting, setIsDecrypting] = useState(false)
    const [decryptError, setDecryptError] = useState<string | null>(null)
    const [isDecryptingWrapped, setIsDecryptingWrapped] = useState(false)
    const [wrappedDecryptError, setWrappedDecryptError] = useState<
        string | null
    >(null)

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
        setWrappedDecryptError(null)
    }, [address])

    // Clear decrypt error when encrypted balance changes
    useEffect(() => {
        if (decryptError) {
            setDecryptError(null)
        }
    }, [encryptedBalance])

    // Clear wrapped decrypt error when wrapped encrypted balance changes
    useEffect(() => {
        if (wrappedDecryptError) {
            setWrappedDecryptError(null)
        }
    }, [wrappedEncryptedBalance])

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
                    CONTRACTS.FAUCET_TOKEN.address,
                    signer,
                )
            }

            console.log('balance', balance)

            setDecryptedBalance(balance)
            setIsBalanceVisible(true)
        } catch (error) {
            console.error('Error decrypting balance:', error)
            setDecryptError('Failed to decrypt balance. Please try again.')
        } finally {
            setIsDecrypting(false)
        }
    }, [address, encryptedBalance, isFHEReady, fheInstance, signer])

    const decryptWrappedBalance = useCallback(async () => {
        if (
            !address ||
            !wrappedEncryptedBalance ||
            !isFHEReady ||
            !fheInstance ||
            !signer
        ) {
            return
        }

        setIsDecryptingWrapped(true)
        setWrappedDecryptError(null)

        try {
            let balance
            if (
                wrappedEncryptedBalance ==
                '0x0000000000000000000000000000000000000000000000000000000000000000'
            ) {
                balance = BigInt(0)
            } else {
                balance = await decryptForUser(
                    fheInstance,
                    wrappedEncryptedBalance as string,
                    CONTRACTS.WRAPPER_TOKEN.address,
                    signer,
                )
            }

            console.log('wrapped balance', balance)

            setWrappedDecryptedBalance(balance)
            setIsWrappedBalanceVisible(true)
        } catch (error) {
            console.error('Error decrypting wrapped balance:', error)
            setWrappedDecryptError(
                'Failed to decrypt wrapped balance. Please try again.',
            )
        } finally {
            setIsDecryptingWrapped(false)
        }
    }, [address, wrappedEncryptedBalance, isFHEReady, fheInstance, signer])

    const toggleBalanceVisibility = () => {
        if (isBalanceVisible) {
            setIsBalanceVisible(false)
            setDecryptedBalance(null)
        } else {
            decryptBalance()
        }
    }

    const toggleWrappedBalanceVisibility = () => {
        if (isWrappedBalanceVisible) {
            setIsWrappedBalanceVisible(false)
            setWrappedDecryptedBalance(null)
        } else {
            decryptWrappedBalance()
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

            {/* Confidential Token Balance */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-green-500" />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Confidential Token
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

            {/* Wrapped Confidential USD Token Balance */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Wrapped USD Token
                        </span>
                        <span className="text-sm font-medium">
                            {isWrappedBalanceVisible &&
                            wrappedDecryptedBalance !== null
                                ? formatTokenAmount(wrappedDecryptedBalance)
                                : '******'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={toggleWrappedBalanceVisibility}
                    disabled={
                        isDecryptingWrapped ||
                        !canDecrypt ||
                        !wrappedEncryptedBalance
                    }
                    className={cn(
                        'p-1.5 rounded-md transition-colors',
                        'hover:bg-gray-100 dark:hover:bg-gray-700',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                    )}
                    title={
                        isWrappedBalanceVisible
                            ? 'Hide wrapped balance'
                            : !wrappedEncryptedBalance
                            ? 'No wrapped tokens'
                            : progress.currentStep?.label ||
                              'Show wrapped balance'
                    }
                >
                    {isDecryptingWrapped ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    ) : isWrappedBalanceVisible ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                    )}
                </button>
            </div>

            {decryptError && (
                <div className="text-xs text-red-500 dark:text-red-400">
                    {decryptError}
                </div>
            )}

            {wrappedDecryptError && (
                <div className="text-xs text-red-500 dark:text-red-400">
                    {wrappedDecryptError}
                </div>
            )}

            {!canDecrypt && !isDecrypting && (
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
