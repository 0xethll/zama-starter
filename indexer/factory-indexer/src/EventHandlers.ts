/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  ConfidentialTokenFactory,
  ConfidentialTokenFactory_TokenWrapped,
  ConfidentialERC20Wrapper,
  ConfidentialERC20Wrapper_ConfidentialTransfer,
  ConfidentialERC20Wrapper_UnwrapRequest,
} from "generated";

// Store token metadata in memory for lookups
const tokenMetadata = new Map<string, { name: string; symbol: string }>();

// Dynamically register new wrapper contracts
ConfidentialTokenFactory.TokenWrapped.contractRegister(({ event, context }) => {
  context.addConfidentialERC20Wrapper(event.params.confidentialToken);
});

ConfidentialTokenFactory.TokenWrapped.handler(async ({ event, context }) => {
  const entity: ConfidentialTokenFactory_TokenWrapped = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    erc20Token: event.params.erc20Token,
    confidentialToken: event.params.confidentialToken,
    name: event.params.name,
    symbol: event.params.symbol,
    creator: event.params.creator,
  };

  context.ConfidentialTokenFactory_TokenWrapped.set(entity);

  // Store token metadata for future lookups
  tokenMetadata.set(event.params.confidentialToken, {
    name: event.params.name,
    symbol: event.params.symbol,
  });
});

ConfidentialERC20Wrapper.ConfidentialTransfer.handler(async ({ event, context }) => {
  const metadata = tokenMetadata.get(event.srcAddress) || {
    name: "Unknown",
    symbol: "UNKNOWN"
  };

  const entity: ConfidentialERC20Wrapper_ConfidentialTransfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenAddress: event.srcAddress,
    tokenName: metadata.name,
    tokenSymbol: metadata.symbol,
    from: event.params.from,
    to: event.params.to,
    amount: event.params.amount,
  };

  context.ConfidentialERC20Wrapper_ConfidentialTransfer.set(entity);
});

ConfidentialERC20Wrapper.UnwrapRequested.handler(async ({ event, context }) => {
  const metadata = tokenMetadata.get(event.srcAddress) || {
    name: "Unknown",
    symbol: "UNKNOWN"
  };

  const entity: ConfidentialERC20Wrapper_UnwrapRequest = {
    id: event.params.amount,
    tokenAddress: event.srcAddress,
    tokenName: metadata.name,
    tokenSymbol: metadata.symbol,
    burntAmount: event.params.amount,
    recipient: event.params.receiver,
    requestBlockNumber: BigInt(event.block.number),
    requestTransactionHash: event.transaction.hash,
    requestTimestamp: BigInt(event.block.timestamp),
    isFinalized: false,
    cleartextAmount: undefined,
    finalizedBlockNumber: undefined,
    finalizedTransactionHash: undefined,
    finalizedTimestamp: undefined,
  };

  context.ConfidentialERC20Wrapper_UnwrapRequest.set(entity);
});

ConfidentialERC20Wrapper.UnwrapFinalized.handler(async ({ event, context }) => {
  const burntAmount = event.params.encryptedAmount;

  // Get the existing unwrap request
  const existingRequest = await context.ConfidentialERC20Wrapper_UnwrapRequest.get(burntAmount);

  if (!existingRequest) {
    // If no existing request found, create a new one (shouldn't happen in normal flow)
    const metadata = tokenMetadata.get(event.srcAddress) || {
      name: "Unknown",
      symbol: "UNKNOWN"
    };

    console.warn(`UnwrapFinalized event for ${burntAmount} but no UnwrapRequested found`);
    const entity: ConfidentialERC20Wrapper_UnwrapRequest = {
      id: burntAmount,
      tokenAddress: event.srcAddress,
      tokenName: metadata.name,
      tokenSymbol: metadata.symbol,
      burntAmount: burntAmount,
      recipient: event.params.receiver,
      requestBlockNumber: BigInt(event.block.number),
      requestTransactionHash: event.transaction.hash,
      requestTimestamp: BigInt(event.block.timestamp),
      isFinalized: true,
      cleartextAmount: event.params.cleartextAmount,
      finalizedBlockNumber: BigInt(event.block.number),
      finalizedTransactionHash: event.transaction.hash,
      finalizedTimestamp: BigInt(event.block.timestamp),
    };
    context.ConfidentialERC20Wrapper_UnwrapRequest.set(entity);
  } else {
    // Update the existing request with finalization data
    const updatedEntity: ConfidentialERC20Wrapper_UnwrapRequest = {
      ...existingRequest,
      isFinalized: true,
      cleartextAmount: event.params.cleartextAmount,
      finalizedBlockNumber: BigInt(event.block.number),
      finalizedTransactionHash: event.transaction.hash,
      finalizedTimestamp: BigInt(event.block.timestamp),
    };
    context.ConfidentialERC20Wrapper_UnwrapRequest.set(updatedEntity);
  }
});
