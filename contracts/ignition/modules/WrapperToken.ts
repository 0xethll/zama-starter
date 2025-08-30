import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('WrapperTokenModule', (m) => {
    const underlyingTokenAddress = m.getParameter('underlyingToken')

    if (!underlyingTokenAddress) {
        throw new Error(
            'underlyingToken address must be provided and cannot be the zero address',
        )
    }

    const wrapperToken = m.contract('WrapperToken', [
        'Wrapped USD Coin',
        'WUSD',
        '',
        underlyingTokenAddress,
    ])

    return { wrapperToken }
})
