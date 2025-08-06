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
      <div className="flex justify-center w-full h-1/2 max-w-3xl p-6 border rounded-lg shadow-sm bg-white">
        <Spinner />
      </div>
    );
  }

  const fromToken = tokens?.find((t) => t.id === tokenSelections.from.tokenId) || null;
  const toToken = tokens?.find((t) => t.id === tokenSelections.to.tokenId) || null;

  return (
    <div
      className={`token-converter-card w-full max-w-3xl p-6 border rounded-lg shadow-sm bg-white ${className}`}
    >
      <div className="mb-4">
        <TokenInput value={amount} onChange={setAmount} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
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
          <SwapButton onClick={handleSwapTokens} />
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
    </div>
  );
}
