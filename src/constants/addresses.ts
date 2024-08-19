import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from 'dependencies/v2-sdk'
import { FACTORY_ADDRESS as V3_FACTORY_ADDRESS } from 'dependencies/v3-sdk'
import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const UNI_ADDRESS: AddressMap = constructSameAddressMap('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')
export const MULTICALL_ADDRESS: AddressMap = constructSameAddressMap('0xe8E802dCA3c36D7C33C09169689664Dd117798Dc')

export const V2_FACTORY_ADDRESSES: AddressMap = constructSameAddressMap(V2_FACTORY_ADDRESS)
export const V2_ROUTER_ADDRESS: AddressMap = constructSameAddressMap('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D')

/**
 * The older V0 governance account
 */
export const GOVERNANCE_ALPHA_V0_ADDRESSES: AddressMap = constructSameAddressMap(
  '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'
)
/**
 * The latest governor alpha that is currently admin of timelock
 */
export const GOVERNANCE_ALPHA_V1_ADDRESSES: AddressMap = {
  [SupportedChainId.KAKAROT]: '0xC4e172459f1E7939D522503B81AFAaC1014CE6F6',
}

export const TIMELOCK_ADDRESS: AddressMap = constructSameAddressMap('0x1a9C8182C09F50C8318d769245beA52c32BE35BC')

export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [SupportedChainId.KAKAROT]: '0x090D4613473dEE047c3f2706764f49E0821D256e',
}
export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [SupportedChainId.KAKAROT]: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8',
}
export const V3_CORE_FACTORY_ADDRESSES: AddressMap = constructSameAddressMap(V3_FACTORY_ADDRESS)
export const QUOTER_ADDRESSES: AddressMap = constructSameAddressMap('0x839fa6870b8C8D0E6E2A16D397b4dD455cb25890')
export const POOL_ADDRESSES_ADDRESSES: AddressMap = constructSameAddressMap(
  '0x4204E2E52F3765260AeBD2Aeff6407A8e8DC98fb'
)
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = constructSameAddressMap(
  '0x341628c364622d5bA49674aCd20C50170E960ee6'
)
export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.KAKAROT]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.ROPSTEN]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.GOERLI]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.RINKEBY]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
}
export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [SupportedChainId.KAKAROT]: '0x65770b5283117639760beA3F867b69b3697a91dd',
}
export const SWAP_ROUTER_ADDRESSES: AddressMap = constructSameAddressMap('0x24D765930dd67D6ADeE674A747DF1D87fFd41221')
export const V3_MIGRATOR_ADDRESSES: AddressMap = constructSameAddressMap('0x5523cc092D499b7e548f748B8B3D39D82418FDda')
