import type { Token } from '../../types/tokens';
import useTokenPrice from './hooks/useTokenPrice';
import useTokenInfo from './hooks/useTokenInfo';
import { Skeleton } from '../../ui/loading/Skeleton';
import type { Erc20AssetInfo } from '@funkit/api-base';
import Popover from '../../ui/form/Popover';
import { CHAIN_CONFIG } from '../../const/chains';
import { useEffect, useState } from 'react';
import InformationCircleIcon from '../../assets/icons/InformationCircleIcon';
import { formatAmount } from '../../utils/amount';
import Tooltip from '../../ui/basic/Tooltip';
import { ErrorAlert } from '../../ui/feedback/ErrorAlert';

function TokenSelect({
  tokens,
  selectedToken,
  onTokenSelect,
}: {
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token | null) => void;
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
        if (val === '') {
          onTokenSelect(null); // Handle null selection
        } else {
          const token = tokens.find((t) => t.id === val);
          if (token) onTokenSelect(token);
        }
      }}
      placeholder="Select token"
      searchPlaceholder="Search token"
      buttonClassName="w-full h-10 border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-500 transition focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
      popoverClassName="shadow-xl border border-gray-200"
      optionClassName="hover:[background:var(--color-card-hover)]"
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
    return (
      <div className="w-full">
        <Skeleton className="h-5 w-full" />
      </div>
    );
  }

  const amount = `${formatAmount(tokenAmount)} ${tokenInfo.symbol}`;

  return (
    <Tooltip content={amount}>
      <div className="text-sm transition-colors duration-100 text-[var(--color-text)] font-mono tracking-tight mt-2 truncate overflow-ellipsis">
        {amount}
      </div>
    </Tooltip>
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
    return (
      <div className="w-full mt-1">
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-[0.625rem] leading-[1rem] text-gray-400 font-mono tracking-tight mt-1">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <InformationCircleIcon className="h-[0.625rem]" />
        <span className="whitespace-nowrap">
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
        <div className="flex items-center gap-2 flex-shrink-0 sm:pl-2">
          <div className="flex items-center gap-2">
            <span
              className={`${priceDifference.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
            >
              {priceDifference.trend === 'up' ? '+' : '-'}$
              {Math.abs(priceDifference.value).toFixed(2)}
            </span>
            <span
              className={`${priceDifference.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
            >
              ({priceDifference.trend === 'up' ? '+' : ''}
              {priceDifference.percent.toFixed(2)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TokenSelector({
  tokens = [],
  selectedToken,
  onTokenSelect,
  oppositeToken,
  amount,
  label,
  onPriceUpdate,
  priceDifference,
}: {
  tokens?: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token | null) => void;
  oppositeToken: Token | null;
  amount: string;
  label: string;
  onPriceUpdate?: (price: number) => void; // New callback
  priceDifference?: {
    value: number;
    percent: number;
    trend: 'up' | 'down';
  };
}) {
  const availableTokens = tokens.filter((token) => token.id !== oppositeToken?.id);

  const { data: tokenInfo, error: tokenInfoError } = useTokenInfo({
    chainId: selectedToken?.chainId,
    symbol: selectedToken?.symbol,
  });

  const {
    data: price,
    isLoading: isLoadingPrice,
    error: errorPrice,
  } = useTokenPrice({
    chainId: tokenInfo?.chain,
    tokenAddress: tokenInfo?.address,
  });

  // Notify parent when price updates
  useEffect(() => {
    if (price?.unitPrice && onPriceUpdate) {
      onPriceUpdate(price.unitPrice);
    }
  }, [price?.unitPrice, onPriceUpdate]);

  const tokenAmount = amount && price?.unitPrice ? parseFloat(amount) / price.unitPrice : 0;
  const error = tokenInfoError?.message || errorPrice?.message;

  return (
    <>
      {error ? <ErrorAlert message={error} /> : null}
      <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg shadow-sm w-full min-w-0">
        <div className="flex justify-between items-center min-w-0">
          <span className="text-xs font-medium transition-colors duration-100 text-[var(--color-text-secondary)] uppercase tracking-wider truncate">
            {label}
          </span>
          {selectedToken && (
            <div className="flex items-center min-w-0">
              <span className="text-xs text-gray-500 font-mono truncate">
                {selectedToken.chainName}
              </span>
              <img
                src={`https://icons.llamao.fi/icons/chains/rsz_${CHAIN_CONFIG.find((c) => c.id === selectedToken.chainId)?.icon}.jpg`}
                alt={selectedToken.chainName}
                className="w-4 h-4 rounded-full ml-2"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-3 w-full min-w-0">
          <div className="min-w-0 flex-1 overflow-hidden">
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

        <PriceDisclaimer
          tokenInfo={tokenInfo}
          unitPrice={price?.unitPrice}
          isLoading={isLoadingPrice}
          priceDifference={priceDifference || undefined}
        />
      </div>
    </>
  );
}
