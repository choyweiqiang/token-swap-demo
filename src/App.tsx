import { useEffect, useState, useCallback } from 'react';
import TokenConverter from './features/token-converter/TokenConverter';
import './styles/global.css';
import ChainSwitcher from './features/chain-switcher/ChainSwitcher';
import { ThemeToggle } from './ui/theme/ThemeToggle';
import RecentlyUsedTokens from './features/token-converter/RecentlyUsedTokens';
import type { Token } from './types/tokens';

interface TokenSelection {
  chainId: string;
  tokenId: string | null;
}

function App() {
  const [selectedChainIds, setSelectedChainIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedChains');
    return saved ? JSON.parse(saved) : ['1', '137', '8453'];
  });

  const [tokenSelections, setTokenSelections] = useState<{
    from: TokenSelection;
    to: TokenSelection;
  }>(() => {
    const saved = localStorage.getItem('tokenSelections');
    return saved
      ? JSON.parse(saved)
      : { from: { chainId: '', tokenId: null }, to: { chainId: '', tokenId: null } };
  });

  const [apiError, setApiError] = useState<Error | null>(null);

  useEffect(() => {
    localStorage.setItem('selectedChains', JSON.stringify(selectedChainIds));
    localStorage.setItem('tokenSelections', JSON.stringify(tokenSelections));
  }, [selectedChainIds, tokenSelections]);

  const handleChainChange = (newChainIds: string[]) => {
    setSelectedChainIds(newChainIds);

    setTokenSelections((prev) => ({
      from:
        prev.from.tokenId && newChainIds.includes(prev.from.chainId)
          ? prev.from
          : { chainId: '', tokenId: null },
      to:
        prev.to.tokenId && newChainIds.includes(prev.to.chainId)
          ? prev.to
          : { chainId: '', tokenId: null },
    }));
  };

  const activeTokenIds = [tokenSelections.from.tokenId, tokenSelections.to.tokenId].filter(
    Boolean,
  ) as string[];

  const handleRecentTokenSelect = useCallback((token: Token) => {
    setTokenSelections((prev) => ({
      ...prev,
      to: {
        chainId: token.chainId,
        tokenId: token.id,
      },
    }));
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 gap-6">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="text-center">
        <h1
          className="text-2xl font-semibold mb-2 text-gray-900 transition-colors duration-100"
          style={{ color: ' var(--color-text)' }}
        >
          Token Price Explorer
        </h1>
        <p className="text-gray-500 mb-6">
          Explore crypto token values and see real-time conversion rates
        </p>
      </div>

      <ChainSwitcher selectedChainIds={selectedChainIds} onChange={handleChainChange} />

      <TokenConverter
        chainIds={selectedChainIds}
        tokenSelections={tokenSelections}
        onTokenSelect={setTokenSelections}
        onError={setApiError}
        className="w-full max-w-3xl"
      />

      <RecentlyUsedTokens
        activeTokenIds={activeTokenIds}
        onTokenSelect={handleRecentTokenSelect}
        selectedChainIds={selectedChainIds}
        apiError={apiError}
      />
    </div>
  );
}

export default App;
