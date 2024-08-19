import { t } from '@lingui/macro'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Activity } from 'react-feather'
import styled from 'styled-components/macro'
import { useAccount } from 'wagmi'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { ButtonSecondary } from '../Button'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  border: none;
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 9999px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
  background: var(--Gradient, linear-gradient(270deg, #f5b12d 0%, #f26619 100%));
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};

  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  font-weight: 500;
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  width: fit-content;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

const ModalOption = styled.div`
  background-color: #ffffff;
  min-width: 290px;
  min-height: 100px;
  position: absolute;
  margin-top: 230px;
  z-index: 2;
  right: 10px;
  padding: 16px;
  border-radius: 24px;
  box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.1);
`
const OptionGrid = styled.div`
  display: grid;
  padding-top: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
  `};
`
const Option = styled.div`
  /* background-color: #fff; */
  padding: 1rem;
  outline: none;
  border: none;
  border-radius: 99px;
  width: 100% !important;
  color: #262626;
  font-weight: 600;
  &:hover {
    background-color: #fef0e8;
  }
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Sock() {
  return (
    <span role="img" aria-label={t`has socks emoji`} style={{ marginTop: -4, marginBottom: -4 }}>
      🧦
    </span>
  )
}

function Web3StatusInner() {
  const { address: account } = useAccount()
  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()
  const [showModal, setShowModal] = useState(false)

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()
  const isSafePal = window.ethereum && window.ethereum.isSafePal

  const handleConnect = () => {
    localStorage.setItem('isLogout', 'false')
  }

  const componentRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        event.target &&
        event.target instanceof Node &&
        !componentRef.current.contains(event.target) &&
        !modalRef.current?.contains(event.target)
      ) {
        setShowModal(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return removeEventListener('click', handleClickOutside)
  }, [])

  // const switchChain = useCallback(async () => {
  //   try {
  //     await window.ethereum?.request({
  //       method: 'wallet_switchEthereumChain',
  //       params: [{ chainId: '0x1388' }],
  //     })
  //   } catch (err) {
  //     // This error code indicates that the chain has not been added to MetaMask
  //     // @ts-ignore
  //     if (err.code === 4902) {
  //       await window.ethereum?.request({
  //         method: 'wallet_addEthereumChain',
  //         params: [
  //           {
  //             chainName: 'Mantle Mainnet',
  //             chainId: '0x1388',
  //             iconUrls: ['https://icons.llamao.fi/icons/chains/rsz_mantle.jpg'],
  //             nativeCurrency: {
  //               name: 'Mantle',
  //               decimals: 18,
  //               symbol: 'MNT',
  //             },
  //             rpcUrls: ['https://rpc.mantle.xyz'],
  //           },
  //         ],
  //       })
  //     }
  //   }
  // }, [window.ethereum])

  return <ConnectButton />
}

export default function Web3Status() {
  const { address: account } = useAccount()

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  /* if (!contextNetwork.active && !active) {
    return null
  } */

  return (
    <>
      <Web3StatusInner />
    </>
  )
}
