import { CHAIN_CONFIG } from '../../const/chains';

export default function ChainSwitcher({
  selectedChainIds = CHAIN_CONFIG.map((chain) => chain.id),
  onChange,
}: {
  selectedChainIds?: string[];
  onChange: (chainIds: string[]) => void;
}) {
  const allSelected = selectedChainIds.length === CHAIN_CONFIG.length;
  const someSelected = selectedChainIds.length > 0 && !allSelected;

  const toggleAllChains = () => {
    onChange(allSelected ? [] : CHAIN_CONFIG.map((chain) => chain.id));
  };

  const toggleChain = (chainId: string) => {
    onChange(
      selectedChainIds.includes(chainId)
        ? selectedChainIds.filter((id) => id !== chainId)
        : [...selectedChainIds, chainId],
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-gray-700 text-center mb-2 font-mono tracking-wider">
        Select chains
      </h2>

      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
        <div className="flex flex-wrap gap-2 max-w-md">
          {CHAIN_CONFIG.map((chain) => (
            <button
              key={chain.id}
              onClick={() => toggleChain(chain.id)}
              className={`px-3 py-1 text-xs rounded-full border flex items-center transition-all font-mono tracking-tight ${
                selectedChainIds.includes(chain.id)
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <img
                src={`https://icons.llamao.fi/icons/chains/rsz_${chain.icon}.jpg`}
                alt={chain.name}
                className="w-4 h-4 rounded-full mr-2"
              />
              {chain.name}
            </button>
          ))}
        </div>

        <button
          onClick={toggleAllChains}
          className="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title={allSelected ? 'Deselect all' : 'Select all'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              strokeDasharray={someSelected ? '4 2' : '0'}
            />
            {allSelected ? (
              <path d="M8 12h8" /> // Minus icon when all selected
            ) : (
              <>
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
