// Contract addresses and ABIs for the application

export const CONTRACTS = {
    FAUCET_TOKEN: {
        address: '0x78ab3a36B4DD7bB2AD45808F9C5dAe9a1c075C19' as const,
        abi: [
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    {
                        internalType: 'externalEuint64',
                        name: 'amount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'inputProof',
                        type: 'bytes',
                    },
                ],
                name: 'mint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'user', type: 'address' },
                ],
                name: 'getLastMintTime',
                outputs: [
                    { internalType: 'uint256', name: '', type: 'uint256' },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'MINT_COOLDOWN',
                outputs: [
                    { internalType: 'uint256', name: '', type: 'uint256' },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'MAX_MINT_AMOUNT',
                outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'confidentialBalanceOf',
                outputs: [
                    { internalType: 'euint64', name: '', type: 'bytes32' },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    {
                        internalType: 'externalEuint64',
                        name: 'encryptedAmount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'inputProof',
                        type: 'bytes',
                    },
                ],
                name: 'confidentialTransfer',
                outputs: [
                    { internalType: 'euint64', name: '', type: 'bytes32' },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    {
                        internalType: 'externalEuint64',
                        name: 'amount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'inputProof',
                        type: 'bytes',
                    },
                ],
                name: 'burn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'timeRemaining',
                        type: 'uint256',
                    },
                ],
                name: 'MintCooldownActive',
                type: 'error',
            },
        ] as const,
    },
    USD_ERC20: {
        address: '0xE9813e4c768C14bE7219dFB7882Da1aBF14236E8' as const,
        abi: [
            {
                inputs: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'symbol',
                        type: 'string',
                    },
                    {
                        internalType: 'uint8',
                        name: 'decimals_',
                        type: 'uint8',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'constructor',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'spender',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'allowance',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'needed',
                        type: 'uint256',
                    },
                ],
                name: 'ERC20InsufficientAllowance',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'sender',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'balance',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'needed',
                        type: 'uint256',
                    },
                ],
                name: 'ERC20InsufficientBalance',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'approver',
                        type: 'address',
                    },
                ],
                name: 'ERC20InvalidApprover',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'receiver',
                        type: 'address',
                    },
                ],
                name: 'ERC20InvalidReceiver',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'sender',
                        type: 'address',
                    },
                ],
                name: 'ERC20InvalidSender',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'spender',
                        type: 'address',
                    },
                ],
                name: 'ERC20InvalidSpender',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'timeRemaining',
                        type: 'uint256',
                    },
                ],
                name: 'MintCooldownActive',
                type: 'error',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'spender',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'uint256',
                        name: 'value',
                        type: 'uint256',
                    },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'uint256',
                        name: 'value',
                        type: 'uint256',
                    },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'MAX_MINT_AMOUNT',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'MINT_COOLDOWN',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'spender',
                        type: 'address',
                    },
                ],
                name: 'allowance',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'spender',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'value',
                        type: 'uint256',
                    },
                ],
                name: 'approve',
                outputs: [
                    {
                        internalType: 'bool',
                        name: '',
                        type: 'bool',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'balanceOf',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'burn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'burnFrom',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [
                    {
                        internalType: 'uint8',
                        name: '',
                        type: 'uint8',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'user',
                        type: 'address',
                    },
                ],
                name: 'getLastMintTime',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: '',
                        type: 'address',
                    },
                ],
                name: 'lastMintTime',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'mint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [
                    {
                        internalType: 'string',
                        name: '',
                        type: 'string',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [
                    {
                        internalType: 'string',
                        name: '',
                        type: 'string',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'value',
                        type: 'uint256',
                    },
                ],
                name: 'transfer',
                outputs: [
                    {
                        internalType: 'bool',
                        name: '',
                        type: 'bool',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'value',
                        type: 'uint256',
                    },
                ],
                name: 'transferFrom',
                outputs: [
                    {
                        internalType: 'bool',
                        name: '',
                        type: 'bool',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ] as const,
    },
    WRAPPER_TOKEN: {
        address: '0x521681652F0E3E6C0D074E9FFB50B38dc10C836e' as const,
        abi: [
            {
                inputs: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'symbol',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'uri',
                        type: 'string',
                    },
                    {
                        internalType: 'contract IERC20',
                        name: 'underlying',
                        type: 'address',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'constructor',
            },
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'requestId',
                        type: 'uint256',
                    },
                ],
                name: 'ConfidentialFungibleTokenInvalidGatewayRequest',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'receiver',
                        type: 'address',
                    },
                ],
                name: 'ConfidentialFungibleTokenInvalidReceiver',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'sender',
                        type: 'address',
                    },
                ],
                name: 'ConfidentialFungibleTokenInvalidSender',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                ],
                name: 'ConfidentialFungibleTokenUnauthorizedCaller',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'holder',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'spender',
                        type: 'address',
                    },
                ],
                name: 'ConfidentialFungibleTokenUnauthorizedSpender',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'euint64',
                        name: 'amount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'address',
                        name: 'user',
                        type: 'address',
                    },
                ],
                name: 'ConfidentialFungibleTokenUnauthorizedUseOfEncryptedAmount',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'holder',
                        type: 'address',
                    },
                ],
                name: 'ConfidentialFungibleTokenZeroBalance',
                type: 'error',
            },
            {
                inputs: [],
                name: 'HandlesAlreadySavedForRequestID',
                type: 'error',
            },
            {
                inputs: [],
                name: 'InvalidKMSSignatures',
                type: 'error',
            },
            {
                inputs: [],
                name: 'NoHandleFoundForRequestID',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'uint8',
                        name: 'bits',
                        type: 'uint8',
                    },
                    {
                        internalType: 'uint256',
                        name: 'value',
                        type: 'uint256',
                    },
                ],
                name: 'SafeCastOverflowedUintDowncast',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'token',
                        type: 'address',
                    },
                ],
                name: 'SafeERC20FailedOperation',
                type: 'error',
            },
            {
                inputs: [],
                name: 'UnsupportedHandleType',
                type: 'error',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'euint64',
                        name: 'encryptedAmount',
                        type: 'bytes32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint64',
                        name: 'amount',
                        type: 'uint64',
                    },
                ],
                name: 'AmountDisclosed',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        indexed: true,
                        internalType: 'euint64',
                        name: 'amount',
                        type: 'bytes32',
                    },
                ],
                name: 'ConfidentialTransfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint256',
                        name: 'requestID',
                        type: 'uint256',
                    },
                ],
                name: 'DecryptionFulfilled',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'holder',
                        type: 'address',
                    },
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'operator',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'until',
                        type: 'uint48',
                    },
                ],
                name: 'OperatorSet',
                type: 'event',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        internalType: 'externalEuint64',
                        name: 'amount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'inputProof',
                        type: 'bytes',
                    },
                ],
                name: 'burn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'confidentialBalanceOf',
                outputs: [
                    {
                        internalType: 'euint64',
                        name: '',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'confidentialTotalSupply',
                outputs: [
                    {
                        internalType: 'euint64',
                        name: '',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'externalEuint64',
                        name: 'encryptedAmount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'inputProof',
                        type: 'bytes',
                    },
                ],
                name: 'confidentialTransfer',
                outputs: [
                    {
                        internalType: 'euint64',
                        name: '',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'euint64',
                        name: 'amount',
                        type: 'bytes32',
                    },
                ],
                name: 'confidentialTransfer',
                outputs: [
                    {
                        internalType: 'euint64',
                        name: '',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'euint64',
                        name: 'amount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'confidentialTransferAndCall',
                outputs: [
                    {
                        internalType: 'euint64',
                        name: 'transferred',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'externalEuint64',
                        name: 'encryptedAmount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'inputProof',
                        type: 'bytes',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'confidentialTransferAndCall',
                outputs: [
                    {
                        internalType: 'euint64',
                        name: 'transferred',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'externalEuint64',
                        name: 'encryptedAmount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'inputProof',
                        type: 'bytes',
                    },
                ],
                name: 'confidentialTransferFrom',
                outputs: [
                    {
                        internalType: 'euint64',
                        name: 'transferred',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'euint64',
                        name: 'amount',
                        type: 'bytes32',
                    },
                ],
                name: 'confidentialTransferFrom',
                outputs: [
                    {
                        internalType: 'euint64',
                        name: 'transferred',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'externalEuint64',
                        name: 'encryptedAmount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'inputProof',
                        type: 'bytes',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'confidentialTransferFromAndCall',
                outputs: [
                    {
                        internalType: 'euint64',
                        name: 'transferred',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'euint64',
                        name: 'amount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'confidentialTransferFromAndCall',
                outputs: [
                    {
                        internalType: 'euint64',
                        name: 'transferred',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [
                    {
                        internalType: 'uint8',
                        name: '',
                        type: 'uint8',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'euint64',
                        name: 'encryptedAmount',
                        type: 'bytes32',
                    },
                ],
                name: 'discloseEncryptedAmount',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'requestId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint64',
                        name: 'amount',
                        type: 'uint64',
                    },
                    {
                        internalType: 'bytes[]',
                        name: 'signatures',
                        type: 'bytes[]',
                    },
                ],
                name: 'finalizeDiscloseEncryptedAmount',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'requestID',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint64',
                        name: 'amount',
                        type: 'uint64',
                    },
                    {
                        internalType: 'bytes[]',
                        name: 'signatures',
                        type: 'bytes[]',
                    },
                ],
                name: 'finalizeUnwrap',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'holder',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'spender',
                        type: 'address',
                    },
                ],
                name: 'isOperator',
                outputs: [
                    {
                        internalType: 'bool',
                        name: '',
                        type: 'bool',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [
                    {
                        internalType: 'string',
                        name: '',
                        type: 'string',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: '',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'onTransferReceived',
                outputs: [
                    {
                        internalType: 'bytes4',
                        name: '',
                        type: 'bytes4',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'rate',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'operator',
                        type: 'address',
                    },
                    {
                        internalType: 'uint48',
                        name: 'until',
                        type: 'uint48',
                    },
                ],
                name: 'setOperator',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [
                    {
                        internalType: 'string',
                        name: '',
                        type: 'string',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'tokenURI',
                outputs: [
                    {
                        internalType: 'string',
                        name: '',
                        type: 'string',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'underlying',
                outputs: [
                    {
                        internalType: 'contract IERC20',
                        name: '',
                        type: 'address',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'externalEuint64',
                        name: 'encryptedAmount',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'bytes',
                        name: 'inputProof',
                        type: 'bytes',
                    },
                ],
                name: 'unwrap',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'from',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'euint64',
                        name: 'amount',
                        type: 'bytes32',
                    },
                ],
                name: 'unwrap',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'wrap',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ] as const,
    },
} as const

// Contract constants
export const MINT_AMOUNT = BigInt(1000 * 1000000) // 1000 tokens with 6 decimals
export const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Network configuration
export const SEPOLIA_CHAIN_ID = 11155111
