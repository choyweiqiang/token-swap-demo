import Select from '../../ui/form/Select';
import type { Token } from '../../types/tokens';
import useTokenPrice from './hooks/useTokenPrice';
import useTokenInfo from './hooks/useTokenInfo';
import { Skeleton } from '../../ui/loading/Skeleton';
import type { Erc20AssetInfo } from '@funkit/api-base';

function TokenSelect({
  tokens,
  selectedToken,
  onTokenSelect,
}: {
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
}) {
  const options = tokens.map((token) => ({
    value: token.symbol,
    label: `${token.name} (${token.symbol})`,
  }));

  return (
    <Select
      options={options}
      value={selectedToken?.symbol || ''}
      onChange={(e) => {
        const token = tokens.find((t) => t.symbol === e.target.value);
        if (token) onTokenSelect(token);
      }}
      placeholder="Select token"
    />
  );
}

function PriceDisplay({
  tokenInfo,
  isLoading,
  tokenAmount,
}: {
  tokenInfo?: Erc20AssetInfo;
  isLoading: boolean;
  tokenAmount: number;
}) {
  if (!tokenInfo || isLoading) {
    return <Skeleton className="h-6 w-1/2" />;
  }

  return (
    <div className="text-sm text-gray-600 ml-2">
      ≈ {tokenAmount} {tokenInfo.symbol}
    </div>
  );
}

function PriceDisclaimer({
  tokenInfo,
  isLoading,
  unitPrice,
}: {
  tokenInfo?: Erc20AssetInfo;
  isLoading: boolean;
  unitPrice?: number;
}) {
  if (!tokenInfo || isLoading) {
    return <Skeleton className="h-4 w-1/2" />;
  }

  return (
    <div className="text-xs text-gray-500 mt-1">
      1 {tokenInfo.symbol} = ${unitPrice?.toFixed(4) || 0}
    </div>
  );
}

export default function TokenSelector({
  tokens,
  selectedToken,
  onTokenSelect,
  oppositeToken,
  amount,
}: {
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  oppositeToken: Token | null;
  amount: string;
}) {
  const availableTokens = tokens.filter((token) => token.symbol !== oppositeToken?.symbol);

  const { data: tokenInfo } = useTokenInfo({
    chainId: selectedToken?.chainId,
    symbol: selectedToken?.symbol,
  });

  const { data: price, isLoading: isLoadingPrice } = useTokenPrice({
    chainId: tokenInfo?.chain,
    tokenAddress: tokenInfo?.address,
  });

  const tokenAmount = amount ? parseFloat(amount) / (price?.unitPrice || 6) : 0;

  return (
    <div className="flex flex-col gap-2 items-center my-2 p-3 border rounded-lg bg-gray-50">
      <TokenSelect
        tokens={availableTokens}
        selectedToken={selectedToken}
        onTokenSelect={onTokenSelect}
      />
      <PriceDisplay tokenInfo={tokenInfo} tokenAmount={tokenAmount} isLoading={isLoadingPrice} />
      <PriceDisclaimer
        tokenInfo={tokenInfo}
        unitPrice={price?.unitPrice}
        isLoading={isLoadingPrice}
      />
    </div>
  );
}
