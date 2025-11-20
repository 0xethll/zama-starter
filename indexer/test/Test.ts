import assert from "assert";
import { 
  TestHelpers,
  ConfidentialUSDX402_ConfidentialTransfer
} from "generated";
const { MockDb, ConfidentialUSDX402 } = TestHelpers;

describe("ConfidentialUSDX402 contract ConfidentialTransfer event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for ConfidentialUSDX402 contract ConfidentialTransfer event
  const event = ConfidentialUSDX402.ConfidentialTransfer.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("ConfidentialUSDX402_ConfidentialTransfer is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await ConfidentialUSDX402.ConfidentialTransfer.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualConfidentialUSDX402ConfidentialTransfer = mockDbUpdated.entities.ConfidentialUSDX402_ConfidentialTransfer.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedConfidentialUSDX402ConfidentialTransfer: ConfidentialUSDX402_ConfidentialTransfer = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      from: event.params.from,
      to: event.params.to,
      amount: event.params.amount,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualConfidentialUSDX402ConfidentialTransfer, expectedConfidentialUSDX402ConfidentialTransfer, "Actual ConfidentialUSDX402ConfidentialTransfer should be the same as the expectedConfidentialUSDX402ConfidentialTransfer");
  });
});
