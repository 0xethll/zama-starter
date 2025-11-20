'use client'

import { AppLayout } from '@/components/AppLayout'
import { useState, useEffect } from 'react'
import {
    ArrowUpDown,
    Shield,
    DollarSign,
    Info,
    CheckCircle,
    AlertCircle,
    Loader2,
} from 'lucide-react'
import { useAccount } from 'wagmi'
import {
    useWrapToken,
    useUnwrapToken,
    useUsdAllowance,
    useUsdApproval,
} from '@/hooks/useWrapUnwrap'
import { useUsdBalance, useCUSDBalance } from '@/hooks/useTokenContract'
import { useFHEContext } from '@/contexts/FHEContext'
import { formatUnits, parseUnits } from 'viem'
import { encryptUint64 } from '@/lib/fhe'
import { toHex } from 'viem'
import { CONTRACTS } from '@/lib/contracts'
import { formatTokenAmount } from '@/lib/fhe'
import { UnwrapRequestsList } from '@/components/UnwrapRequestsList'
import { useUnwrapRequests } from '@/hooks/useUnwrapRequests'

export default function WrapPage() {
    const { address, isConnected } = useAccount()
    const { balance: usdBalance, refetch: refetchUsdBalance } = useUsdBalance()
    const { encryptedBalance: cUSDBalance, refetch: refetchCUSDBalance } = useCUSDBalance()
    const { allowance: usdAllowance, refetchAllowance } = useUsdAllowance()
    const {
        isFHEReady,
        fheInstance,
        fheError,
        isBalanceVisible,
        decryptedBalance
    } = useFHEContext()

    // Fetch unwrap requests
    const { requests: unwrapRequests, isLoading: isLoadingRequests, error: requestsError, refetch: refetchRequests } = useUnwrapRequests()

    const [wrapAmount, setWrapAmount] = useState('')
    const [unwrapAmount, setUnwrapAmount] = useState('')
    const [isPreparingUnwrap, setIsPreparingUnwrap] = useState(false)

    const {
        approveTokens,
        isApproving,
        isConfirmed: isApprovalConfirmed,
        approvalError,
        resetApproval,
    } = useUsdApproval()

    const {
        wrapTokens,
        isWrapping,
        isConfirmed: isWrapConfirmed,
        wrapError,
        resetWrap,
    } = useWrapToken()

    const {
        unwrapTokens,
        isUnwrapping,
        isConfirmed: isUnwrapConfirmed,
        unwrapError,
        resetUnwrap,
    } = useUnwrapToken(async () => {
        // Wait for indexer to process the transaction
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Refetch unwrap requests to show the newly created request
        for (let i = 0; i < 3; i++) {
            await refetchRequests()
            if (i < 2) {
                await new Promise(resolve => setTimeout(resolve, 2000))
            }
        }
    })

    // Handle successful approval - refetch allowance to update needsApproval logic
    useEffect(() => {
        if (isApprovalConfirmed) {
            // Refetch allowance to update the needsApproval calculation
            refetchAllowance()
        }
    }, [isApprovalConfirmed, refetchAllowance])

    // Reset preparing state when unwrap completes or errors
    useEffect(() => {
        if (isUnwrapConfirmed || unwrapError) {
            setIsPreparingUnwrap(false)
        }
    }, [isUnwrapConfirmed, unwrapError])

    const handleApprove = async () => {
        if (!wrapAmount || !isConnected) return

        try {
            approveTokens(wrapAmount)
        } catch (error) {
            console.error('Approval error:', error)
        }
    }

    const handleWrap = async () => {
        if (!wrapAmount || !isConnected) return

        try {
            wrapTokens(wrapAmount)
            setWrapAmount('')
        } catch (error) {
            console.error('Wrap error:', error)
        }
    }

    const handleUnwrap = async () => {
        if (
            !unwrapAmount ||
            !isConnected ||
            !isFHEReady ||
            !fheInstance ||
            !address
        ) {
            return
        }

        setIsPreparingUnwrap(true)

        try {
            // Convert amount to wei (6 decimals)
            const amountWei = parseUnits(unwrapAmount, 6)

            // Encrypt the amount
            const { handle, proof } = await encryptUint64(
                fheInstance,
                CONTRACTS.cUSD_ERC7984.address,
                address,
                amountWei,
            )

            unwrapTokens(
                toHex(handle) as `0x${string}`,
                toHex(proof) as `0x${string}`,
            )
            setUnwrapAmount('')
            setIsPreparingUnwrap(false)
        } catch (error) {
            console.error('Unwrap error:', error)
            setIsPreparingUnwrap(false)
        }
    }

    const maxWrapAmount = usdBalance ? formatUnits(usdBalance, 6) : '0'
    const maxUnwrapAmount =
        isBalanceVisible && cUSDBalance !== null && decryptedBalance
            ? formatTokenAmount(decryptedBalance)
            : '0'

    // Check if we have sufficient allowance for wrapping
    const wrapAmountWei = wrapAmount ? parseUnits(wrapAmount, 6) : BigInt(0)
    const hasInsufficientAllowance =
        usdAllowance !== undefined && wrapAmountWei > usdAllowance
    const needsApproval =
        isConnected &&
        wrapAmount &&
        parseFloat(wrapAmount) > 0 &&
        hasInsufficientAllowance

    const canApprove =
        isConnected &&
        wrapAmount &&
        parseFloat(wrapAmount) > 0 &&
        parseFloat(wrapAmount) <= parseFloat(maxWrapAmount)
    const canWrap =
        isConnected &&
        wrapAmount &&
        parseFloat(wrapAmount) > 0 &&
        parseFloat(wrapAmount) <= parseFloat(maxWrapAmount) &&
        !needsApproval
    const canUnwrap =
        isConnected &&
        isFHEReady &&
        unwrapAmount &&
        parseFloat(unwrapAmount) > 0 &&
        parseFloat(unwrapAmount) <= parseFloat(maxUnwrapAmount) &&
        cUSDBalance

    return (
        <AppLayout>
            <div className="p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                            <ArrowUpDown className="h-8 w-8 text-purple-600" />
                            Wrap & Unwrap Tokens
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Convert between USD tokens and wrapped confidential
                            USD tokens
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                    How Wrapping Works
                                </h3>
                                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                    <li>
                                        • <strong>Wrap:</strong> Convert USD
                                        tokens to Confidential USD tokens
                                        (1:1 ratio)
                                    </li>
                                    <li>
                                        • <strong>Unwrap:</strong> Convert
                                        Confidential USD tokens back to regular USD
                                        tokens
                                    </li>
                                    <li>
                                        • Wrapped tokens maintain privacy
                                        through FHE encryption
                                    </li>
                                    <li>
                                        • Your wrapped balance is encrypted and
                                        only visible to you
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Current Balances */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-blue-500" />
                                USD Token Balance
                            </h3>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {usdBalance ? formatUnits(usdBalance, 6) : '0'}{' '}
                                USD
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                Available to wrap
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-500" />
                                Confidential USD Balance
                            </h3>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {isBalanceVisible &&
                                decryptedBalance !== null
                                    ? `${formatTokenAmount(
                                          decryptedBalance,
                                      )} cUSD`
                                    : '****** cUSD'}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {isBalanceVisible
                                    ? 'Available to unwrap'
                                    : 'Decrypt to view'}
                            </div>
                        </div>
                    </div>

                    {/* Wrap Section */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Shield className="h-6 w-6 text-purple-600" />
                            Wrap USD Tokens
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Convert your USD tokens to confidential USD
                            tokens
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Amount to Wrap
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={wrapAmount}
                                        onChange={(e) =>
                                            setWrapAmount(e.target.value)
                                        }
                                        placeholder="0.0"
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-lg"
                                        max={maxWrapAmount}
                                        step="0.000001"
                                    />
                                    <button
                                        onClick={() =>
                                            setWrapAmount(maxWrapAmount)
                                        }
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                                    >
                                        MAX
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Balance: {maxWrapAmount} USD
                                </div>
                            </div>

                            {needsApproval ? (
                                <button
                                    onClick={handleApprove}
                                    disabled={!canApprove || isApproving}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {isApproving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Approving...
                                        </>
                                    ) : (
                                        'Approve USD Tokens'
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleWrap}
                                    disabled={!canWrap || isWrapping}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {isWrapping ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Wrapping...
                                        </>
                                    ) : (
                                        'Wrap Tokens'
                                    )}
                                </button>
                            )}

                            {approvalError && (
                                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{approvalError}</span>
                                </div>
                            )}

                            {wrapError && (
                                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{wrapError}</span>
                                </div>
                            )}

                            {isApprovalConfirmed && (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>
                                        Successfully approved tokens! You can
                                        now wrap them.
                                    </span>
                                </div>
                            )}

                            {isWrapConfirmed && (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Successfully wrapped tokens!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Unwrap Section */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                            Unwrap to USD Tokens
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Convert your wrapped Confidential USD tokens back to
                            regular USD tokens
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Amount to Unwrap
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={unwrapAmount}
                                        onChange={(e) =>
                                            setUnwrapAmount(e.target.value)
                                        }
                                        placeholder="0.0"
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-lg"
                                        max={maxUnwrapAmount}
                                        step="0.000001"
                                    />
                                    <button
                                        onClick={() =>
                                            setUnwrapAmount(maxUnwrapAmount)
                                        }
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        disabled={!isBalanceVisible}
                                    >
                                        MAX
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {isBalanceVisible
                                        ? `Balance: ${maxUnwrapAmount} cUSD`
                                        : 'Decrypt wrapped balance to view available amount'}
                                </div>
                            </div>

                            <button
                                onClick={handleUnwrap}
                                disabled={
                                    !canUnwrap ||
                                    isUnwrapping ||
                                    isPreparingUnwrap
                                }
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {isPreparingUnwrap ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Preparing...
                                    </>
                                ) : isUnwrapping ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Unwrapping...
                                    </>
                                ) : (
                                    'Unwrap Tokens'
                                )}
                            </button>

                            {!isFHEReady && !fheError && (
                                <p className="text-center text-sm text-blue-600 dark:text-blue-400">
                                    Initializing FHE encryption... Please wait.
                                </p>
                            )}

                            {isFHEReady && !isConnected && (
                                <p className="text-center text-sm text-red-600 dark:text-red-400">
                                    Please connect your wallet to unwrap tokens
                                </p>
                            )}

                            {isConnected &&
                                isFHEReady &&
                                cUSDBalance &&
                                !isBalanceVisible &&
                                unwrapAmount && (
                                    <p className="text-center text-sm text-amber-600 dark:text-amber-400">
                                        Please decrypt your wrapped balance
                                        first to verify the amount you can
                                        unwrap
                                    </p>
                                )}

                            {fheError && (
                                <div className="flex items-center justify-center gap-2 text-center text-sm text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>FHE Error: {fheError}</span>
                                </div>
                            )}

                            {unwrapError && (
                                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{unwrapError}</span>
                                </div>
                            )}

                            {isUnwrapConfirmed && (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Successfully unwrapped tokens!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Unwrap Requests List */}
                    {isConnected && (
                        <div className="mt-8">
                            <UnwrapRequestsList
                                requests={unwrapRequests}
                                isLoading={isLoadingRequests}
                                error={requestsError}
                                refetch={refetchRequests}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
