import { useState } from 'react';
import TokenSelector from './TokenSelector';
import type { Token } from '../../types/tokens';
import { TokenInput } from './TokenInput';
import SwapButton from '../../ui/basic/SwapButton';
import { useCoinGeckoTokens } from './hooks/useCoinGeckoTokens';
import { Spinner } from '../../ui/loading/Spinner';

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
  const { data: tokens, isLoading } = useCoinGeckoTokens({ chainIds });

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
      <div className="flex justify-center w-full max-w-3xl p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        <Spinner />
      </div>
    );
  }

  const fromToken = tokens?.find((t) => t.id === tokenSelections.from.tokenId) || null;
  const toToken = tokens?.find((t) => t.id === tokenSelections.to.tokenId) || null;

  return (
    <div
      className={`w-full max-w-3xl bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <TokenSelector
            tokens={tokens || []}
            selectedToken={fromToken}
            onTokenSelect={(token) => handleTokenSelect('from', token)}
            oppositeToken={toToken}
            amount={amount}
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
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <TokenInput value={amount} onChange={setAmount} />
      </div>
    </div>
  );
}
