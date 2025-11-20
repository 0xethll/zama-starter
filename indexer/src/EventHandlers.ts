/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  ConfidentialUSDX402,
  ConfidentialUSDX402_ConfidentialTransfer,
  ConfidentialUSDX402_UnwrapRequest,
} from "generated";

ConfidentialUSDX402.ConfidentialTransfer.handler(async ({ event, context }) => {
  const entity: ConfidentialUSDX402_ConfidentialTransfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    amount: event.params.amount,
  };

  context.ConfidentialUSDX402_ConfidentialTransfer.set(entity);
});

ConfidentialUSDX402.UnwrapRequested.handler(async ({ event, context }) => {
  // Use burntAmount (the encrypted amount handle) as the unique ID
  const burntAmount = event.params.amount;

  const entity: ConfidentialUSDX402_UnwrapRequest = {
    id: burntAmount,
    burntAmount: burntAmount,
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

  context.ConfidentialUSDX402_UnwrapRequest.set(entity);
});

ConfidentialUSDX402.UnwrapFinalized.handler(async ({ event, context }) => {
  // Use the same burntAmount as ID to update the existing request
  const burntAmount = event.params.encryptedAmount;

  // Get the existing unwrap request
  const existingRequest = await context.ConfidentialUSDX402_UnwrapRequest.get(burntAmount);

  if (!existingRequest) {
    // If no existing request found, create a new one (shouldn't happen in normal flow)
    console.warn(`UnwrapFinalized event for ${burntAmount} but no UnwrapRequested found`);
    const entity: ConfidentialUSDX402_UnwrapRequest = {
      id: burntAmount,
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
    context.ConfidentialUSDX402_UnwrapRequest.set(entity);
  } else {
    // Update the existing request with finalization data
    const updatedEntity: ConfidentialUSDX402_UnwrapRequest = {
      ...existingRequest,
      isFinalized: true,
      cleartextAmount: event.params.cleartextAmount,
      finalizedBlockNumber: BigInt(event.block.number),
      finalizedTransactionHash: event.transaction.hash,
      finalizedTimestamp: BigInt(event.block.timestamp),
    };
    context.ConfidentialUSDX402_UnwrapRequest.set(updatedEntity);
  }
});
