import assert from "assert";
import { 
  TestHelpers,
  ConfidentialTokenFactory_TokenWrapped
} from "generated";
const { MockDb, ConfidentialTokenFactory } = TestHelpers;

describe("ConfidentialTokenFactory contract TokenWrapped event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for ConfidentialTokenFactory contract TokenWrapped event
  const event = ConfidentialTokenFactory.TokenWrapped.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("ConfidentialTokenFactory_TokenWrapped is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await ConfidentialTokenFactory.TokenWrapped.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualConfidentialTokenFactoryTokenWrapped = mockDbUpdated.entities.ConfidentialTokenFactory_TokenWrapped.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedConfidentialTokenFactoryTokenWrapped: ConfidentialTokenFactory_TokenWrapped = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      erc20Token: event.params.erc20Token,
      confidentialToken: event.params.confidentialToken,
      name: event.params.name,
      symbol: event.params.symbol,
      creator: event.params.creator,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualConfidentialTokenFactoryTokenWrapped, expectedConfidentialTokenFactoryTokenWrapped, "Actual ConfidentialTokenFactoryTokenWrapped should be the same as the expectedConfidentialTokenFactoryTokenWrapped");
  });
});
