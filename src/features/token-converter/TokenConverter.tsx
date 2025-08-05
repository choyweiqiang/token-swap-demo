import { useState } from 'react';
import TokenSelector from './TokenSelector';
import type { Token } from '../../types/tokens';
import { tokens } from '../../const/tokens';
import { TokenInput } from './TokenInput';
import SwapButton from '../../ui/basic/SwapButton';

export default function TokenConverter() {
  const [amount, setAmount] = useState<string>('');
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <div className="token-converter-card w-full max-w-3xl p-6 border rounded-lg shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">Token Price Explorer</h1>

      <div className="mb-4">
        <TokenInput value={amount} onChange={setAmount} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <TokenSelector
            tokens={tokens}
            selectedToken={fromToken}
            onTokenSelect={setFromToken}
            oppositeToken={toToken}
            amount={amount}
          />
        </div>

        <div className="flex items-center justify-center">
          <SwapButton onClick={handleSwapTokens} />
        </div>

        <div className="flex-1">
          <TokenSelector
            tokens={tokens}
            selectedToken={toToken}
            onTokenSelect={setToToken}
            oppositeToken={fromToken}
            amount={amount}
          />
        </div>
      </div>
    </div>
  );
}
