import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('USDERC20Module', (m) => {
    const name = m.getParameter('name', 'USD Coin')
    const symbol = m.getParameter('symbol', 'USD')
    const decimals = m.getParameter('decimals', 6)

    const usd = m.contract('USDERC20', [name, symbol, decimals])

    return { usd }
})
