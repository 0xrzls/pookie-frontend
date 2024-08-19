import { kakarotSepolia } from 'wagmi/chains'
import { ethers } from 'ethers'

export const getProvider = () => new ethers.providers.JsonRpcProvider(kakarotSepolia.rpcUrls.default.http[0])

export const provider = getProvider()
