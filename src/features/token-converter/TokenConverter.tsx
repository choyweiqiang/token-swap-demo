import { useEffect, useState } from 'react';
import TokenSelector from './TokenSelector';
import type { Token } from '../../types/tokens';
import { tokens } from '../../const/tokens';
import { TokenInput } from './TokenInput';

export default function TokenConverter() {
  const [amount, setAmount] = useState<string>('');
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [equivalents, setEquivalents] = useState({ a: 0, b: 0 });

  useEffect(() => {
    const calculateEquivalents = async () => {
      if (!amount || !fromToken || !toToken) return;

      try {
        const fromPrice = 1;
        const toPrice = 2;

        setEquivalents({
          a: parseFloat(amount) / fromPrice,
          b: parseFloat(amount) / toPrice,
        });
      } catch (error) {
        console.error('Price fetch failed:', error);
      }
    };

    calculateEquivalents();
  }, [amount, fromToken, toToken]);

  return (
    <div className="token-converter-card w-96 p-6 border rounded-lg shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-4">Token Price Explorer</h1>
      <TokenInput value={amount} onChange={setAmount} />
      <TokenSelector
        tokens={tokens}
        selectedToken={fromToken}
        onTokenSelect={setFromToken}
        oppositeToken={toToken}
      />
      <TokenSelector
        tokens={tokens}
        selectedToken={toToken}
        onTokenSelect={setToToken}
        oppositeToken={fromToken}
      />

      {amount && fromToken && toToken && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
          <p className="font-medium">
            ${parseFloat(amount).toFixed(2)} ≈
            <span className="text-blue-600">
              {' '}
              {equivalents.a.toFixed(6)} {fromToken.symbol}
            </span>
          </p>
          <p className="font-medium">
            ${parseFloat(amount).toFixed(2)} ≈
            <span className="text-green-600">
              {' '}
              {equivalents.b.toFixed(6)} {toToken.symbol}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
