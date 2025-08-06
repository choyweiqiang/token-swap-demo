import { CHAIN_CONFIG } from '../const/chains';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const fetchCoinGeckoTokens = async (filteredChainIds?: string[]) => {
  const chains = CHAIN_CONFIG.filter((chain) => filteredChainIds?.includes(chain.id));

  const responses = await Promise.all(
    chains.map((chain) =>
      fetch(
        `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&category=${chain.category}&per_page=250`,
      ),
    ),
  );

  return await Promise.all(responses.map((response) => response.json()));
};
