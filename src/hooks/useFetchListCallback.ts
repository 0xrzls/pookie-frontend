import { nanoid } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'

import { useAppDispatch } from 'state/hooks'
import { fetchTokenList } from '../state/lists/actions'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/resolveENSContentHash'
import { useChainId } from 'wagmi'
import { useSigner } from './useSigner'

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const signer = useSigner();
  const chainId = useChainId();
  const dispatch = useAppDispatch()

  const ensResolver = useCallback(
    async (ensName: string) => {
      if (!signer || chainId !== 1) {
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, signer.provider)
    },
    [chainId, signer]
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch && dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
          throw error
        })
    },
    [dispatch, ensResolver]
  )
}
