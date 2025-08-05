import { useState } from 'react';
import TokenSelector from './TokenSelector';
import type { Token } from '../../types/tokens';
import { tokens } from '../../const/tokens';
import { TokenInput } from './TokenInput';
import useTokenInfo from './hooks/useTokenInfo';
import useTokenPrice from './hooks/useTokenPrice';

export default function TokenConverter() {
  const [amount, setAmount] = useState<string>('');
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  const { data: fromTokenData } = useTokenInfo({
    chainId: fromToken?.chainId,
    symbol: fromToken?.symbol,
  });
  const { data: toTokenData } = useTokenInfo({
    chainId: toToken?.chainId,
    symbol: toToken?.symbol,
  });

  const { data: fromPrice } = useTokenPrice({
    chainId: fromTokenData?.chain,
    tokenAddress: fromTokenData?.address,
  });
  const { data: toPrice } = useTokenPrice({
    chainId: toTokenData?.chain,
    tokenAddress: toTokenData?.address,
  });

  const equivalentFrom = amount ? parseFloat(amount) / (fromPrice?.unitPrice || 1) : 0;
  const equivalentTo = amount ? parseFloat(amount) / (toPrice?.unitPrice || 1) : 0;

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

      {amount && fromTokenData && toTokenData && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
          <p className="font-medium">
            ${parseFloat(amount).toFixed(2)} ≈{' '}
            <span className="text-blue-600">
              {equivalentFrom.toFixed(fromTokenData.decimals)} {fromTokenData.symbol}
            </span>
          </p>
          <p className="font-medium">
            ${parseFloat(amount).toFixed(2)} ≈{' '}
            <span className="text-green-600">
              {equivalentTo.toFixed(toTokenData.decimals)} {toTokenData.symbol}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
