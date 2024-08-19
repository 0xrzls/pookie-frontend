import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { kakarotSepolia } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'POOKIE',
  projectId: '8db633ff8b3eb6e0272bde4dc9ed4590',
  chains: [
    {
      ...kakarotSepolia,
      iconUrl:
        'https://cdn.prod.website-files.com/6464a063474b57e2c4e03b61/667d1b007ba798c4842b8df9_kakarot_logo_beige-p-500.png',
    },
  ],
  ssr: true,
})
