import type { Token } from '../types/tokens';

export const FALLBACK_TOKENS: Token[] = [
  {
    id: 'usd-coin-1',
    symbol: 'USDC',
    name: 'USDC',
    chainId: '1',
    icon: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
    chainName: 'Ethereum',
  },
  {
    id: 'polygon-bridged-usdt-polygon-137',
    symbol: 'USDT',
    name: 'Polygon Bridged USDT (Polygon)',
    chainId: '137',
    icon: 'https://coin-images.coingecko.com/coins/images/35023/large/USDT.png?1707233644',
    chainName: 'Polygon',
  },
  {
    id: 'usd-coin-8453',
    symbol: 'ETH',
    name: 'Ether',
    chainId: '8453',
    icon: 'https://coin-images.coingecko.com/coins/images/6319/large/ethereum.png?1696506694',
    chainName: 'Base',
  },
  {
    id: 'wrapped-bitcoin-1',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    chainId: '1',
    icon: 'https://coin-images.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857',
    chainName: 'Ethereum',
  },
];
