import { getAssetErc20ByChainAndSymbol, getAssetPriceInfo } from '@funkit/api-base';
import { getApiKey } from '../utils/config';

const apiKey = getApiKey();

export const fetchTokenInfo = async ({ chainId, symbol }: { chainId: string; symbol: string }) => {
  const response = await getAssetErc20ByChainAndSymbol({ chainId, symbol, apiKey });
  return response;
};

export const fetchTokenPrice = async ({
  chainId,
  assetTokenAddress,
}: {
  chainId: string;
  assetTokenAddress: string;
}) => {
  const response = await getAssetPriceInfo({ chainId, assetTokenAddress, apiKey });
  return response;
};
