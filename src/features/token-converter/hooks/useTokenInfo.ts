import { useQuery } from '@tanstack/react-query';
import { fetchTokenInfo } from '../../../api/funkitApi';

export default function useTokenInfo({ chainId, symbol }: { chainId?: string; symbol?: string }) {
  return useQuery({
    queryKey: ['tokenInfo', chainId, symbol],
    queryFn: () => fetchTokenInfo({ chainId: chainId!, symbol: symbol! }),
    enabled: !!symbol,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
