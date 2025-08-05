import Select from '../../ui/form/Select';
import type { Token } from '../../types/tokens';

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
    value: token.symbol,
    label: `${token.name} (${token.symbol})`,
  }));

  return (
    <Select
      options={options}
      value={selectedToken?.symbol || ''}
      onChange={(e) => {
        const token = tokens.find((t) => t.symbol === e.target.value);
        if (token) onTokenSelect(token);
      }}
      placeholder="Select token"
    />
  );
}

export default function TokenSelector({
  tokens,
  selectedToken,
  onTokenSelect,
  oppositeToken,
}: {
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  oppositeToken: Token | null;
}) {
  const availableTokens = tokens.filter((token) => token.symbol !== oppositeToken?.symbol);

  return (
    <div className="my-2">
      <TokenSelect
        tokens={availableTokens}
        selectedToken={selectedToken}
        onTokenSelect={onTokenSelect}
      />
    </div>
  );
}
