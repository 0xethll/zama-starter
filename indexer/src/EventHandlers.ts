/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  ConfidentialUSDX402,
  ConfidentialUSDX402_ConfidentialTransfer,
  ConfidentialUSDX402_UnwrapFinalized,
  ConfidentialUSDX402_UnwrapRequested,
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

ConfidentialUSDX402.UnwrapFinalized.handler(async ({ event, context }) => {
  const entity: ConfidentialUSDX402_UnwrapFinalized = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    receiver: event.params.receiver,
    encryptedAmount: event.params.encryptedAmount,
    cleartextAmount: event.params.cleartextAmount,
  };

  context.ConfidentialUSDX402_UnwrapFinalized.set(entity);
});

ConfidentialUSDX402.UnwrapRequested.handler(async ({ event, context }) => {
  const entity: ConfidentialUSDX402_UnwrapRequested = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    receiver: event.params.receiver,
    amount: event.params.amount,
  };

  context.ConfidentialUSDX402_UnwrapRequested.set(entity);
});
