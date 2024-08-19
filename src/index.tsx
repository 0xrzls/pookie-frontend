import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import '@rainbow-me/rainbowkit/styles.css'
import '@reach/dialog/styles.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { wagmiConfig } from "config/wagmi"
import 'inter-ui'
import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from "wagmi"
import Blocklist from './components/Blocklist'
import { LanguageProvider } from './i18n'
import App from './pages/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import LogsUpdater from './state/logs/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import RadialGradientByChainUpdater from './theme/RadialGradientByChainUpdater'
import { createRoot } from "react-dom/client";

const client = new QueryClient();

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <RadialGradientByChainUpdater />
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      <LogsUpdater />
    </>
  )
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Provider store={store}>
            <BrowserRouter>
              <LanguageProvider>
                <Blocklist>
                  <Updaters />
                  <ThemeProvider>
                    <ThemedGlobalStyle />
                    <App />
                  </ThemeProvider>
                </Blocklist>
              </LanguageProvider>
            </BrowserRouter>
          </Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
)

serviceWorkerRegistration.unregister()
