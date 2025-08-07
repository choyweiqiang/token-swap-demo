import { useEffect, useState } from 'react';
import TokenSelector from './TokenSelector';
import type { Token } from '../../types/tokens';
import { TokenInput } from './TokenInput';
import SwapButton from '../../ui/basic/SwapButton';
import { useCoinGeckoTokens } from './hooks/useCoinGeckoTokens';
import { Spinner } from '../../ui/loading/Spinner';
import { ErrorAlert } from '../../ui/feedback/ErrorAlert';

interface PriceDifference {
  value: number;
  percent: number;
  trend: 'up' | 'down';
}

interface TokenSelection {
  chainId: string;
  tokenId: string | null;
}

export default function TokenConverter({
  chainIds,
  tokenSelections,
  onTokenSelect,
  className = '',
}: {
  chainIds: string[];
  tokenSelections: {
    from: TokenSelection;
    to: TokenSelection;
  };
  onTokenSelect: (selections: { from: TokenSelection; to: TokenSelection }) => void;
  className?: string;
}) {
  const [amount, setAmount] = useState<string>('');
  const { data: tokens, isLoading, error } = useCoinGeckoTokens({ chainIds });

  // Price difference states
  const [fromPriceDiff, setFromPriceDiff] = useState<PriceDifference | null>(null);
  const [toPriceDiff, setToPriceDiff] = useState<PriceDifference | null>(null);
  const [prevFromPrice, setPrevFromPrice] = useState<number | null>(null);
  const [prevToPrice, setPrevToPrice] = useState<number | null>(null);

  const fromToken = tokens?.find((t) => t.id === tokenSelections.from.tokenId) || null;
  const toToken = tokens?.find((t) => t.id === tokenSelections.to.tokenId) || null;

  // Handle price updates from TokenSelectors
  const handleFromPriceUpdate = (newPrice: number) => {
    calculatePriceDifference(newPrice, prevFromPrice, setFromPriceDiff);
    setPrevFromPrice(newPrice);
  };

  const handleToPriceUpdate = (newPrice: number) => {
    calculatePriceDifference(newPrice, prevToPrice, setToPriceDiff);
    setPrevToPrice(newPrice);
  };

  // Reset prices when tokens change
  useEffect(() => {
    setPrevFromPrice(null);
    setFromPriceDiff(null);
  }, [fromToken?.id]);

  useEffect(() => {
    setPrevToPrice(null);
    setToPriceDiff(null);
  }, [toToken?.id]);

  // Helper function for price difference calculation
  const calculatePriceDifference = (
    newPrice: number,
    prevPrice: number | null,
    setDiff: React.Dispatch<React.SetStateAction<PriceDifference | null>>,
  ) => {
    if (prevPrice !== null && prevPrice > 0 && prevPrice !== newPrice) {
      const valueDiff = newPrice - prevPrice;
      const percentDiff = prevPrice !== 0 ? (valueDiff / prevPrice) * 100 : 0;

      const MIN_PRICE_CHANGE = 0.01; // 1%

      if (Math.abs(percentDiff) >= MIN_PRICE_CHANGE) {
        setDiff({
          value: valueDiff,
          percent: percentDiff,
          trend: valueDiff >= 0 ? 'up' : 'down',
        });
      }
    }
  };

  const handleTokenSelect = (type: 'from' | 'to', token: Token | null) => {
    onTokenSelect({
      ...tokenSelections,
      [type]: {
        chainId: token?.chainId || '',
        tokenId: token?.id || null,
      },
    });
  };

  const handleSwapTokens = () => {
    onTokenSelect({
      from: tokenSelections.to,
      to: tokenSelections.from,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center w-full max-w-3xl p-6 border border-gray-200 rounded-lg shadow-sm">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {error ? <ErrorAlert message={error.message} /> : null}
      <div
        className={`
      w-full max-w-3xl p-6 rounded-lg shadow-sm
       border border-gray-200
  ${className}
    `}
      >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <TokenSelector
              tokens={tokens || []}
              selectedToken={fromToken}
              onTokenSelect={(token) => handleTokenSelect('from', token)}
              oppositeToken={toToken}
              amount={amount}
              label="You Pay"
              onPriceUpdate={handleFromPriceUpdate}
              priceDifference={fromPriceDiff || undefined}
            />
          </div>

          <div className="flex items-center justify-center">
            <SwapButton
              onClick={handleSwapTokens}
              className="hover:border-blue-300 hover:text-blue-500"
            />
          </div>

          <div className="flex-1">
            <TokenSelector
              tokens={tokens || []}
              selectedToken={toToken}
              onTokenSelect={(token) => handleTokenSelect('to', token)}
              oppositeToken={fromToken}
              amount={amount}
              label="You Receive"
              onPriceUpdate={handleToPriceUpdate}
              priceDifference={toPriceDiff || undefined}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <TokenInput value={amount} onChange={setAmount} />
        </div>
      </div>
    </>
  );
}
