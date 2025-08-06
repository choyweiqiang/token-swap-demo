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
      buttonClassName="select-focus border-gray-300 hover:border-blue-500 transition focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] focus-visible:border-blue-500"
      popoverClassName="shadow-xl"
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
