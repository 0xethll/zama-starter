import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('FaucetTokenModule', (m) => {
    const faucetToken = m.contract('FaucetToken', [
        'Confidential Token',
        'CFDT',
        '',
    ])

    return { faucetToken }
})
