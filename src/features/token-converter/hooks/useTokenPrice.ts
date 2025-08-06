import { useQuery } from '@tanstack/react-query';
import { fetchTokenPrice } from '../../../api/funkitApi';

export default function useTokenPrice({
  chainId,
  tokenAddress,
}: {
  chainId?: string;
  tokenAddress?: string;
}) {
  return useQuery({
    queryKey: ['tokenPrice', chainId, tokenAddress],
    queryFn: () => fetchTokenPrice({ chainId: chainId!, assetTokenAddress: tokenAddress! }),
    enabled: !!tokenAddress,
    staleTime: 5 * 1000, // Refresh price every 10 seconds
    refetchInterval: 5 * 1000,
  });
}
