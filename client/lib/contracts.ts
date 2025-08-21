// Contract addresses and ABIs for the application

export const CONTRACTS = {
  FAUCET_TOKEN: {
    address: '0x78ab3a36B4DD7bB2AD45808F9C5dAe9a1c075C19' as const,
    abi: [
      {
        inputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'externalEuint64', name: 'amount', type: 'bytes32' },
          { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
        name: 'getLastMintTime',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'MINT_COOLDOWN',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'confidentialBalanceOf',
        outputs: [{ internalType: 'euint64', name: '', type: 'bytes32' }],
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
          { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
        ],
        name: 'confidentialTransfer',
        outputs: [{ internalType: 'euint64', name: '', type: 'bytes32' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'externalEuint64', name: 'amount', type: 'bytes32' },
          { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
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
          { internalType: 'uint256', name: 'timeRemaining', type: 'uint256' },
        ],
        name: 'MintCooldownActive',
        type: 'error',
      },
    ] as const,
  },
} as const

// Contract constants
export const MINT_AMOUNT = BigInt(1000 * 1000000) // 1000 tokens with 6 decimals
export const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Network configuration
export const SEPOLIA_CHAIN_ID = 11155111
