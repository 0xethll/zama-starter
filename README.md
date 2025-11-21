# Zama Starter - A Practical FHE DApp

This project demonstrates practical implementation of Confidential USD operations using Zama's Fully Homomorphic Encryption (FHE) technology. Building upon the OpenZeppelin ERC7984 Contracts, it provides a seamless bridge between traditional ERC20 tokens and their confidential counterparts.

## Live Demo

🚀 **Try it now:** [https://zama-starter.vercel.app](https://zama-starter.vercel.app)

## Key Features

-   **Confidential USD Wrapping/Unwrapping**: Secure conversion between public ERC20 tokens and Confidential USDs while preserving privacy
-   **Private Token Transfers**: Execute Confidential USD transfers with encrypted balances and amounts


### Confidential Token Unwrap Flow with Public Decryption


  Client                    ERC7984 Contract              External Index Service
    |                              |                              |
    |--unwrap(from, to, -------->  |                              |
    |  encryptedAmount,            |                              |
    |  inputProof)                 |                              |
    |                              |                              |
    |                        _burn(from, amount)                  |
    |                        returns burntAmount                  |
    |                              |                              |
    |                              |--emit UnwrapRequested(-----> |
    |                              |  to, burntAmount)            |
    |                              |                              |
    |<-------query pending---------|                              |
    |         requests-------------|----------------------------->|
    |                              |                              |
    | fheInstance.publicDecrypt(burntAmount)                      |
    | → gets cleartextAmount + decryptionProof                    |
    |                              |                              |
    |--finalizeUnwrap(--------->   |                              |
    |  burntAmount,                |                              |
    |  cleartextAmount,            |                              |
    |  decryptionProof)            |                              |
    |                              |                              |

## Technical Implementation

-   Smart contracts built on OpenZeppelin Confidential Contracts v0.3.0
-   Next.js frontend with comprehensive UI/UX optimizations

This represents my second Zama project, focusing on practical utility rather than basic syntax learning. The emphasis on frontend polish and user experience demonstrates how FHE technology can be made accessible to mainstream Web3 users without compromising the underlying privacy guarantees.

## Future Roadmap

-   Migration to OpenZeppelin FHEVM v0.9.1
-   Exploration of additional confidential contract use cases and applications
