import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Histori',
  projectId: 'Histori',
  chains: [
    mainnet,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
});
