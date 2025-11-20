## Usage

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY

npx hardhat keystore set SEPOLIA_RPC_URL
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ./ignition/modules/WrapperToken.ts --parameters ./ignition/parameters/WrapperToken.json
```

## Deployed Addresses

<!-- FaucetToken - 0x78ab3a36B4DD7bB2AD45808F9C5dAe9a1c075C19
FaucetToken - 2 minutes claim period for tesing - 0x84b490df85214c40B01dEA0bf444c9C744cAdB94

USDERC20Module#USDERC20 - 0xE9813e4c768C14bE7219dFB7882Da1aBF14236E8
WrapperTokenModule#WrapperToken - 0x521681652F0E3E6C0D074E9FFB50B38dc10C836e

cUSDModule#ConfidentialUSD - 0x18227D887fcf647666be16A4Da83Db3b1a5F7cE5
cUSDX402Module#ConfidentialUSDX402 - 0x35d4494F0888ac5CaB0697Be47fbF54Fe96e00c1 -->

USDModule#USDERC20 - 0x491a02a05c7e377ff2094D0fD41fB6D0b9D0848e
cUSDX402Module#ConfidentialUSDX402 - 0x8c28fD5DeFf5996C8aa04C8c0176Ac5123C1b5de