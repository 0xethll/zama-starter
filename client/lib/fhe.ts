// FHE utilities and configuration for Zama integration

import {
  initSDK,
  createInstance,
  SepoliaConfig,
  FhevmInstance,
} from '@zama-fhe/relayer-sdk/bundle'

// // Type for Ethereum provider
// interface EthereumProvider {
//   request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
//   on: (event: string, listener: (...args: unknown[]) => void) => void
//   removeListener: (
//     event: string,
//     listener: (...args: unknown[]) => void,
//   ) => void
// }

// // Type for window with ethereum
// declare global {
//   interface Window {
//     ethereum?: EthereumProvider
//   }
// }

// Type for signer (simplified ethers.Signer interface)
interface Signer {
  address: string
  signTypedData: (
    domain: Record<string, unknown>,
    types: Record<string, unknown>,
    message: Record<string, unknown>,
  ) => Promise<string>
}

/**
 * Initialize the FHE SDK
 * Must be called before using any FHE functionality
 */
export async function initializeFHE(): Promise<void> {
  await initSDK()
}

/**
 * Create an FHE instance for Sepolia testnet
 * Requires window.ethereum to be available
 */
export async function createFHEInstance(): Promise<FhevmInstance> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Ethereum provider not available')
  }

  const config = {
    ...SepoliaConfig,
    network: window.ethereum,
  }

  return await createInstance(config)
}

/**
 * Encrypt a 64-bit unsigned integer for contract use
 */
export async function encryptUint64(
  fheInstance: FhevmInstance,
  contractAddress: string,
  userAddress: string,
  value: bigint,
): Promise<{
  handle: Uint8Array<ArrayBufferLike>
  proof: Uint8Array<ArrayBufferLike>
}> {
  const input = fheInstance.createEncryptedInput(contractAddress, userAddress)
  input.add64(value)

  const encryptedInput = await input.encrypt()

  return {
    handle: encryptedInput.handles[0],
    proof: encryptedInput.inputProof,
  }
}

/**
 * Decrypt a ciphertext handle for the user
 * Requires user signature for authorization
 */
export async function decryptForUser(
  fheInstance: FhevmInstance,
  ciphertextHandle: string,
  contractAddress: string,
  signer: Signer,
): Promise<bigint> {
  const keypair = fheInstance.generateKeypair()

  const handleContractPairs = [
    {
      handle: ciphertextHandle,
      contractAddress: contractAddress,
    },
  ]

  const startTimeStamp = Math.floor(Date.now() / 1000).toString()
  const durationDays = '10'
  const contractAddresses = [contractAddress]

  const eip712 = fheInstance.createEIP712(
    keypair.publicKey,
    contractAddresses,
    startTimeStamp,
    durationDays,
  )

  const signature = await signer.signTypedData(
    eip712.domain,
    {
      UserDecryptRequestVerification:
        eip712.types.UserDecryptRequestVerification,
    },
    eip712.message,
  )

  const result = await fheInstance.userDecrypt(
    handleContractPairs,
    keypair.privateKey,
    keypair.publicKey,
    signature.replace('0x', ''),
    contractAddresses,
    signer.address,
    startTimeStamp,
    durationDays,
  )

  return BigInt(result[ciphertextHandle])
}

/**
 * Format tokens for display (assuming 6 decimals)
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 6,
): string {
  const divisor = BigInt(10 ** decimals)
  const wholePart = amount / divisor
  const fractionalPart = amount % divisor

  if (fractionalPart === 0n) {
    return wholePart.toString()
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  const trimmedFractional = fractionalStr.replace(/0+$/, '')

  return `${wholePart}.${trimmedFractional}`
}

/**
 * Parse token amount from string to bigint (assuming 6 decimals)
 */
export function parseTokenAmount(amount: string, decimals: number = 6): bigint {
  const [wholePart = '0', fractionalPart = ''] = amount.split('.')
  const paddedFractional = fractionalPart
    .padEnd(decimals, '0')
    .slice(0, decimals)
  const fullAmount = wholePart + paddedFractional
  return BigInt(fullAmount)
}
