import { useQuery } from '@tanstack/react-query';
import { fetchCoinGeckoTokens } from '../../../api/coinGeckoApi';
import type { Token } from '../../../types/tokens';
import { CHAIN_CONFIG } from '../../../const/chains';

interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  image?: string;
}

export const useCoinGeckoTokens = (options?: { chainIds?: string[] }) => {
  return useQuery<CoinGeckoToken[][], Error, Token[]>({
    queryKey: ['erc20-tokens', options],
    queryFn: () => fetchCoinGeckoTokens(options?.chainIds),
    select: (data) => {
      const activeChains = options?.chainIds
        ? options.chainIds?.map((chainId) => CHAIN_CONFIG.find((chain) => chain.id === chainId))
        : CHAIN_CONFIG;

      return data.flatMap((chainTokens, index) => {
        const chain = activeChains?.[index];

        return chainTokens.map((token) => ({
          id: `${token.id}-${chain!.id}`,
          symbol: token.symbol.toUpperCase(),
          name: token.name,
          chainId: chain!.id,
          icon: token.image,
          chainName: chain!.name,
        }));
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
