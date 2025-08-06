import type { Token } from '../../types/tokens';
import useTokenPrice from './hooks/useTokenPrice';
import useTokenInfo from './hooks/useTokenInfo';
import { Skeleton } from '../../ui/loading/Skeleton';
import type { Erc20AssetInfo } from '@funkit/api-base';
import Popover from '../../ui/form/Popover';
import { CHAIN_CONFIG } from '../../const/chains';
import { useEffect, useState } from 'react';
import InformationCircleIcon from '../../assets/icons/InformationCircleIcon';

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
      buttonClassName="w-full h-10 border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-500 transition focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
      popoverClassName="shadow-xl border border-gray-200 bg-white"
      optionClassName="hover:bg-blue-50"
      minWidth="18rem"
      maxWidth="26rem"
      align="right"
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
    return <Skeleton className="h-5 w-full" />;
  }

  return (
    <div className="text-sm text-gray-600 font-mono tracking-tight mt-2">
      {tokenAmount.toFixed(6)} {tokenInfo.symbol}
    </div>
  );
}

function PriceDisclaimer({
  tokenInfo,
  isLoading,
  unitPrice,
  priceDifference,
}: {
  tokenInfo?: Erc20AssetInfo;
  isLoading: boolean;
  unitPrice?: number;
  priceDifference?: {
    value: number;
    percent: number;
    trend: 'up' | 'down';
  };
}) {
  const [showChangeIndicator, setShowChangeIndicator] = useState<boolean>(false);

  useEffect(() => {
    if (priceDifference && priceDifference.value !== 0) {
      setShowChangeIndicator(true);
      const timer = setTimeout(() => setShowChangeIndicator(false), 1000); // Fades after 1 second
      return () => clearTimeout(timer);
    }
  }, [priceDifference]);

  if (!tokenInfo || isLoading) {
    return <Skeleton className="h-4 w-full mt-1" />;
  }

  return (
    <div className="flex items-center justify-between text-xs text-gray-400 font-mono tracking-tight mt-1">
      <div className="flex items-center gap-1">
        <InformationCircleIcon />
        <span>
          1 {tokenInfo.symbol} = ${unitPrice?.toFixed(6) || '0.00'}
        </span>
        {showChangeIndicator && (
          <span
            className={`ml-1 h-1 w-1 rounded-full ${
              priceDifference?.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
            } opacity-0 animate-[fadeOut_1s_ease-out_forwards]`}
          />
        )}
      </div>

      {priceDifference && priceDifference.value !== 0 && (
        <div className="flex items-center gap-2">
          <span className={`${priceDifference.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {priceDifference.trend === 'up' ? '+' : '-'}$
            {Math.abs(priceDifference.value).toFixed(2)}
          </span>
          <span className={`${priceDifference.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            ({priceDifference.trend === 'up' ? '+' : ''}
            {priceDifference.percent.toFixed(2)}%)
          </span>
        </div>
      )}
    </div>
  );
}

export default function TokenSelector({
  tokens,
  selectedToken,
  onTokenSelect,
  oppositeToken,
  amount,
  label,
}: {
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token | null) => void;
  oppositeToken: Token | null;
  amount: string;
  label: string;
}) {
  const availableTokens = tokens.filter((token) => token.id !== oppositeToken?.id);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceDifference, setPriceDifference] = useState<{
    value: number;
    percent: number;
    trend: 'up' | 'down';
  } | null>(null);

  const { data: tokenInfo } = useTokenInfo({
    chainId: selectedToken?.chainId,
    symbol: selectedToken?.symbol,
  });

  const { data: price, isLoading: isLoadingPrice } = useTokenPrice({
    chainId: tokenInfo?.chain,
    tokenAddress: tokenInfo?.address,
  });

  const tokenAmount = amount ? parseFloat(amount) / (price?.unitPrice || 6) : 0;

  useEffect(() => {
    if (price?.unitPrice) {
      // Only calculate difference if we have a valid previous price (> 0)
      if (previousPrice !== null && previousPrice > 0 && previousPrice !== price.unitPrice) {
        const valueDiff = price.unitPrice - previousPrice;
        const percentDiff = previousPrice !== 0 ? (valueDiff / previousPrice) * 100 : 0;

        const MIN_PRICE_CHANGE = 0.01; // 1%

        if (Math.abs(percentDiff) >= MIN_PRICE_CHANGE) {
          setPriceDifference({
            value: valueDiff,
            percent: percentDiff,
            trend: valueDiff >= 0 ? 'up' : 'down',
          });
        }
      }
      setPreviousPrice(price.unitPrice);
    }
  }, [price?.unitPrice]);

  return (
    <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
        {selectedToken && (
          <div className="flex items-center">
            <span className="text-xs text-gray-500 font-mono">{selectedToken.chainName}</span>
            <img
              src={`https://icons.llamao.fi/icons/chains/rsz_${CHAIN_CONFIG.find((c) => c.id === selectedToken.chainId)?.icon}.jpg`}
              alt={selectedToken.chainName}
              className="w-4 h-4 rounded-full ml-2"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-3">
        <div className="min-w-[120px]">
          <PriceDisplay
            tokenInfo={tokenInfo}
            tokenAmount={tokenAmount}
            isLoading={isLoadingPrice}
          />
        </div>
        <TokenSelect
          tokens={availableTokens}
          selectedToken={selectedToken}
          onTokenSelect={onTokenSelect}
        />
      </div>

      {selectedToken && (
        <PriceDisclaimer
          tokenInfo={tokenInfo}
          unitPrice={price?.unitPrice}
          isLoading={isLoadingPrice}
          priceDifference={priceDifference || undefined}
        />
      )}
    </div>
  );
}
