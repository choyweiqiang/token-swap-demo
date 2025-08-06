import type { Token } from '../../types/tokens';
import useTokenPrice from './hooks/useTokenPrice';
import useTokenInfo from './hooks/useTokenInfo';
import { Skeleton } from '../../ui/loading/Skeleton';
import type { Erc20AssetInfo } from '@funkit/api-base';
import Popover from '../../ui/form/Popover';
import { CHAIN_CONFIG } from '../../const/chains';

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
    value: token.id,
    label: token.name,
    symbol: token.symbol,
    icon: token.icon || '/unknown-logo.png',
    chainName: token.chainName,
    chainIcon: CHAIN_CONFIG.find((c) => c.id === token.chainId)?.icon
      ? `https://icons.llamao.fi/icons/chains/rsz_${CHAIN_CONFIG.find((c) => c.id === token.chainId)?.icon}.jpg`
      : '/unknown-logo.png',
  }));

  return (
    <Popover
      options={options}
      value={selectedToken?.id || ''}
      onChange={(val) => {
        const token = tokens.find((t) => t.id === val);
        if (token) onTokenSelect(token);
      }}
      placeholder="Select token"
      searchPlaceholder="Search token"
      buttonClassName="w-full h-10 border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      popoverClassName="shadow-xl border border-gray-200"
      optionClassName="hover:bg-blue-50"
      minWidth="20rem"
      maxWidth="30rem"
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
    return <Skeleton className="h-5 w-24" />;
  }

  return (
    <div className="text-sm text-gray-600 font-mono tracking-tight">
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
    return <Skeleton className="h-4 w-32 mt-1" />;
  }

  return (
    <div className="text-xs text-gray-500 font-mono tracking-tight">
      1 {tokenInfo.symbol} = ${unitPrice?.toFixed(6) || '0.00'}
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
  onTokenSelect: (token: Token | null) => void;
  oppositeToken: Token | null;
  amount: string;
}) {
  const availableTokens = tokens.filter((token) => token.id !== oppositeToken?.id);

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
    <div className="flex flex-col gap-2 p-3">
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
