import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('cUSDX402Module', (m) => {
    const cUSDX402 = m.contract('ConfidentialUSDX402', [
        'Confidential USD',
        'cUSD',
        '',
        '0xD47511c9dE5a9c03E28064962E57B8AC26e33c50',
    ])

    return { cUSDX402 }
})
