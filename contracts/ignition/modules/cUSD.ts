import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('cUSDModule', (m) => {
    const cUSD = m.contract('ConfidentialUSD', [
        'Confidential USD',
        'cUSD',
        '',
    ])

    return { cUSD }
})
