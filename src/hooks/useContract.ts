import { Contract } from '@ethersproject/contracts'
import GOVERNANCE_ABI from '@uniswap/governance/build/GovernorAlpha.json'
import UNI_ABI from '@uniswap/governance/build/Uni.json'
import STAKING_REWARDS_ABI from '@uniswap/liquidity-staker/build/StakingRewards.json'
import MERKLE_DISTRIBUTOR_ABI from '@uniswap/merkle-distributor/build/MerkleDistributor.json'
import IUniswapV2PairABI from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import QuoterABI from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import V2MigratorABI from '@uniswap/v3-periphery/artifacts/contracts/V3Migrator.sol/V3Migrator.json'
import IUniswapV2Router02ABI from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import MulticallABI from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'

import ARGENT_WALLET_DETECTOR_ABI from 'abis/argent-wallet-detector.json'
import ENS_PUBLIC_RESOLVER_ABI from 'abis/ens-public-resolver.json'
import ENS_ABI from 'abis/ens-registrar.json'
import ERC20_ABI from 'abis/erc20.json'
import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json'
import WETH_ABI from 'abis/weth.json'
import EIP_2612 from 'abis/eip_2612.json'

import {
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
  QUOTER_ADDRESSES,
  V3_MIGRATOR_ADDRESSES,
  ARGENT_WALLET_DETECTOR_ADDRESS,
  MERKLE_DISTRIBUTOR_ADDRESS,
  MULTICALL_ADDRESS,
  V2_ROUTER_ADDRESS,
  ENS_REGISTRAR_ADDRESSES,
  GOVERNANCE_ALPHA_V0_ADDRESSES,
  GOVERNANCE_ALPHA_V1_ADDRESSES,
} from 'constants/addresses'
import NFTPositionManagerABI from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { useMemo } from 'react'
import { Quoter, NonfungiblePositionManager, UniswapInterfaceMulticall } from 'types/v3'
import { V3Migrator } from 'types/v3/V3Migrator'
import { Erc20, ArgentWalletDetector, EnsPublicResolver, EnsRegistrar, Weth } from '../abis/types'
import { UNI, WETH9_EXTENDED } from '../constants/tokens'
import { useAccount, useChainId } from 'wagmi'
import { useSigner } from './useSigner'
import { provider } from 'utils/providers'

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const signer = useSigner()
  const { address: account } = useAccount()
  const chainId = useChainId()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return new Contract(address, ABI, signer || provider)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, provider, signer, withSignerIfPossible, account, chainId]) as T
}

function useContractRpcProvider<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any
): T | null {
  const chainId = useChainId()
  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return new Contract(address, ABI, provider)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, chainId]) as T
}

export function useV2MigratorContract() {
  return useContract<V3Migrator>(V3_MIGRATOR_ADDRESSES, V2MigratorABI.abi, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean) {
  const chainId = useChainId()
  return useContract<Weth>(chainId ? WETH9_EXTENDED[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useArgentWalletDetectorContract() {
  return useContract<ArgentWalletDetector>(ARGENT_WALLET_DETECTOR_ADDRESS, ARGENT_WALLET_DETECTOR_ABI, false)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean) {
  return useContract<EnsRegistrar>(ENS_REGISTRAR_ADDRESSES, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean) {
  return useContract<EnsPublicResolver>(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612, false)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI.abi, withSignerIfPossible)
}

export function useV2RouterContract(): Contract | null {
  return useContract(V2_ROUTER_ADDRESS, IUniswapV2Router02ABI.abi, true)
}

export function useMulticall2Contract() {
  return useContractRpcProvider<UniswapInterfaceMulticall>(
    MULTICALL_ADDRESS,
    MulticallABI.abi
  ) as UniswapInterfaceMulticall
}

export function useMerkleDistributorContract() {
  return useContract(MERKLE_DISTRIBUTOR_ADDRESS, MERKLE_DISTRIBUTOR_ABI.abi, true)
}

export function useGovernanceV0Contract(): Contract | null {
  return useContract(GOVERNANCE_ALPHA_V0_ADDRESSES, GOVERNANCE_ABI.abi, true)
}

export function useGovernanceV1Contract(): Contract | null {
  return useContract(GOVERNANCE_ALPHA_V1_ADDRESSES, GOVERNANCE_ABI.abi, true)
}

export const useLatestGovernanceContract = useGovernanceV1Contract

export function useUniContract() {
  const chainId = useChainId()
  return useContract(chainId ? UNI[chainId]?.address : undefined, UNI_ABI.abi, true)
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean) {
  return useContract(stakingAddress, STAKING_REWARDS_ABI.abi, withSignerIfPossible)
}

export function useV3NFTPositionManagerContract(withSignerIfPossible?: boolean): NonfungiblePositionManager | null {
  return useContract<NonfungiblePositionManager>(
    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
    NFTPositionManagerABI.abi,
    withSignerIfPossible
  )
}

export function useV3Quoter() {
  return useContract<Quoter>(QUOTER_ADDRESSES, QuoterABI.abi)
}
