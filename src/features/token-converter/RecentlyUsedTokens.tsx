import { useEffect, useState } from 'react';
import type { Token } from '../../types/tokens';
import useTokenPrice from './hooks/useTokenPrice';
import useTokenInfo from './hooks/useTokenInfo';
import { CHAIN_CONFIG } from '../../const/chains';
import { Skeleton } from '../../ui/loading/Skeleton';
import { WarningAlert } from '../../ui/feedback/WarningAlert';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

interface RecentToken extends Token {
  priceHistory: number[];
  currentPrice: number | null;
  priceChange: {
    value: number;
    percent: number;
    trend: 'up' | 'down' | 'neutral';
  } | null;
}

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface RecentlyUsedTokensProps {
  activeTokenIds: string[];
  onTokenSelect: (token: Token) => void;
}

export default function RecentlyUsedTokens({
  activeTokenIds,
  onTokenSelect,
}: RecentlyUsedTokensProps) {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [recentTokens, setRecentTokens] = useState<RecentToken[]>(() => {
    const saved = localStorage.getItem('recentlyUsedTokens');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recentlyUsedTokens', JSON.stringify(recentTokens));
  }, [recentTokens]);

  const addToRecentlyUsed = (token: Token) => {
    setRecentTokens((prev) => {
      const existingIndex = prev.findIndex((t) => t.id === token.id);

      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        const updated = [...prev];
        updated.splice(existingIndex, 1);
        updated.unshift({
          ...existing,
          priceHistory: existing.priceHistory || [],
        });
        return updated.slice(0, 4);
      }

      const newToken: RecentToken = {
        ...token,
        priceHistory: [],
        currentPrice: null,
        priceChange: null,
      };

      return [newToken, ...prev].slice(0, 4);
    });
  };

  const updateToken = (tokenId: string, updates: Partial<RecentToken>) => {
    setRecentTokens((prev) => {
      return prev.map((t) => {
        if (t.id === tokenId) {
          return { ...t, ...updates };
        }
        return t;
      });
    });
  };

  useEffect(() => {
    // @ts-expect-error - Adding to window for external access
    window.addToRecentlyUsed = addToRecentlyUsed;

    return () => {
      // @ts-expect-error - Cleanup
      delete window.addToRecentlyUsed;
    };
  }, []);

  if (recentTokens.length === 0) {
    return null;
  }

  const handleTokenSelect = (token: Token) => {
    if (activeTokenIds.includes(token.id)) {
      setWarningMessage(`${token.name} is already selected in the converter`);
      setTimeout(() => setWarningMessage(null), 3000);
      return;
    }

    addToRecentlyUsed(token);

    onTokenSelect(token);
  };

  return (
    <div className="w-full max-w-3xl mt-6 p-6 rounded-lg shadow-sm border border-gray-200">
      {warningMessage && <WarningAlert message={warningMessage} />}
      <h2 className="text-sm font-medium mb-4 text-[var(--color-text-secondary)] uppercase tracking-wider">
        Recently Used Tokens
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {recentTokens.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            isActive={activeTokenIds.includes(token.id)}
            onSelect={() => handleTokenSelect(token)}
            updateToken={updateToken}
          />
        ))}
      </div>
    </div>
  );
}

function TokenCard({
  token,
  isActive,
  onSelect,
  updateToken,
}: {
  token: RecentToken;
  isActive: boolean;
  onSelect: () => void;
  updateToken: (tokenId: string, updates: Partial<RecentToken>) => void;
}) {
  const [priceHistory, setPriceHistory] = useState<number[]>(token.priceHistory || []);

  const { data: tokenInfo } = useTokenInfo({
    chainId: token.chainId,
    symbol: token.symbol,
  });

  const { data: price, isLoading: isLoadingPrice } = useTokenPrice({
    chainId: tokenInfo?.chain,
    tokenAddress: tokenInfo?.address,
  });

  useEffect(() => {
    if (price?.unitPrice) {
      setPriceHistory((prev) => {
        const newHistory = [...prev, price.unitPrice];

        return newHistory.slice(-10);
      });
    }
  }, [price?.unitPrice]);

  const priceChange = calculatePriceChange(priceHistory);

  useEffect(() => {
    if (price?.unitPrice) {
      updateToken(token.id, {
        priceHistory,
        currentPrice: price.unitPrice,
        priceChange,
      });
    }
  }, [token.id, priceHistory, price?.unitPrice, priceChange, updateToken]);

  const chainIcon = CHAIN_CONFIG.find((c) => c.id === token.chainId)?.icon
    ? `https://icons.llamao.fi/icons/chains/rsz_${CHAIN_CONFIG.find((c) => c.id === token.chainId)?.icon}.jpg`
    : '/unknown-logo.png';

  return (
    <div
      className={`
        p-4 rounded-lg border cursor-pointer transition-all
        ${isActive ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-blue-300'}
      `}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 mb-2">
        <img
          src={token.icon || '/unknown-logo.png'}
          alt={token.name}
          className="w-6 h-6 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{token.symbol}</div>
          <div className="text-xs text-gray-500 truncate">{token.name}</div>
        </div>
        <img src={chainIcon} alt={token.chainName} className="w-4 h-4 rounded-full ml-1" />
      </div>

      {isLoadingPrice ? (
        <Skeleton className="h-5 w-full mt-2" />
      ) : (
        <div className="mt-2">
          <div className="font-mono text-sm">${price?.unitPrice?.toFixed(6) || '0.00'}</div>
          {priceChange && (
            <div className="flex items-center gap-2 text-[8px] font-mono mt-1">
              <span className={`${priceChange.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange.trend === 'up' ? '+' : '-'}${Math.abs(priceChange.value).toFixed(4)}
              </span>
              <span className={`${priceChange.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                ({priceChange.trend === 'up' ? '+' : ''}
                {priceChange.percent.toFixed(2)}%)
              </span>
            </div>
          )}

          {priceHistory.length > 0 && (
            <div className="mt-3 h-24">
              <Line
                data={{
                  labels:
                    priceHistory.length === 1
                      ? [
                          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        ]
                      : priceHistory.map((_, index) => {
                          if (index === 0 || index === priceHistory.length - 1) {
                            const now = new Date();

                            const minutesAgo = (priceHistory.length - 1 - index) * 5;
                            now.setMinutes(now.getMinutes() - minutesAgo);
                            return now.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                          }
                          return '';
                        }),
                  datasets: [
                    {
                      data:
                        priceHistory.length === 1
                          ? [priceHistory[0], priceHistory[0]]
                          : priceHistory,
                      borderColor: () => {
                        if (priceHistory.length >= 2) {
                          const lastPrice = priceHistory[priceHistory.length - 1];
                          const prevPrice = priceHistory[priceHistory.length - 2];
                          if (lastPrice > prevPrice) return '#10B981';
                          if (lastPrice < prevPrice) return '#EF4444';
                        }
                        return '#6B7280';
                      },
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 50);

                        let color = '#6B7280';
                        if (priceHistory.length >= 2) {
                          const lastPrice = priceHistory[priceHistory.length - 1];
                          const prevPrice = priceHistory[priceHistory.length - 2];
                          if (lastPrice > prevPrice) color = '#10B981';
                          else if (lastPrice < prevPrice) color = '#EF4444';
                        }

                        gradient.addColorStop(0, `${color}33`);
                        gradient.addColorStop(1, `${color}00`);
                        return gradient;
                      },
                      borderWidth: 1,
                      tension: 0,
                      fill: true,
                      pointRadius: 0,
                      order: 1,
                    },

                    ...(priceHistory.length <= 3
                      ? [
                          {
                            data:
                              priceHistory.length === 1
                                ? [price?.unitPrice || 0, price?.unitPrice || 0]
                                : Array(priceHistory.length).fill(price?.unitPrice || 0),
                            borderColor: '#3B82F6',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            pointRadius: 0,
                            fill: false,
                            tension: 0,
                            order: 0,
                          },
                        ]
                      : []),

                    ...(priceHistory.length > 1
                      ? [
                          {
                            data: Array(priceHistory.length).fill(
                              calculatePercentile(priceHistory, 0.25),
                            ),
                            borderColor: '#9CA3AF',
                            borderWidth: 1,
                            borderDash: [3, 3],
                            pointRadius: 0,
                            fill: false,
                            tension: 0,
                            order: 4,
                          },

                          {
                            data: Array(priceHistory.length).fill(
                              calculatePercentile(priceHistory, 0.5),
                            ),
                            borderColor: '#6B7280',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            pointRadius: 0,
                            fill: false,
                            tension: 0,
                            order: 3,
                          },

                          {
                            data: Array(priceHistory.length).fill(
                              calculatePercentile(priceHistory, 0.75),
                            ),
                            borderColor: '#9CA3AF',
                            borderWidth: 1,
                            borderDash: [3, 3],
                            pointRadius: 0,
                            fill: false,
                            tension: 0,
                            order: 2,
                          },
                        ]
                      : []),
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      enabled: false,
                      mode: 'index',
                      intersect: false,
                      position: 'nearest',

                      external: function (context) {
                        const tooltipEl = document.getElementById('chartjs-tooltip');

                        if (!tooltipEl) {
                          const div = document.createElement('div');
                          div.id = 'chartjs-tooltip';
                          div.innerHTML = '<div></div>';
                          document.body.appendChild(div);
                        }

                        const tooltipModel = context.tooltip;
                        if (tooltipModel.opacity === 0) {
                          document.getElementById('chartjs-tooltip')!.style.opacity = '0';
                          return;
                        }

                        const tooltipDiv = document.getElementById('chartjs-tooltip')!;
                        tooltipDiv.classList.remove('above', 'below', 'no-transform');
                        if (tooltipModel.yAlign) {
                          tooltipDiv.classList.add(tooltipModel.yAlign);
                        } else {
                          tooltipDiv.classList.add('no-transform');
                        }

                        if (tooltipModel.body) {
                          const titleLines = tooltipModel.title || [];
                          const bodyLines = tooltipModel.body.map((b) => b.lines);

                          let innerHtml =
                            '<div class="p-2 rounded-md shadow-md bg-[var(--color-card)] border border-[var(--color-border)]">';

                          innerHtml +=
                            '<div class="font-medium text-xs text-[var(--color-text)] mb-1">';
                          titleLines.forEach(function (title) {
                            innerHtml += title;
                          });
                          innerHtml += '</div>';

                          bodyLines.forEach(function (body) {
                            innerHtml +=
                              '<div class="text-xs text-[var(--color-text-secondary)]">' +
                              body +
                              '</div>';
                          });
                          innerHtml += '</div>';

                          tooltipDiv.querySelector('div')!.innerHTML = innerHtml;
                        }

                        const position = context.chart.canvas.getBoundingClientRect();
                        tooltipDiv.style.opacity = '1';
                        tooltipDiv.style.position = 'absolute';
                        tooltipDiv.style.left =
                          position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                        tooltipDiv.style.top =
                          position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                        tooltipDiv.style.pointerEvents = 'none';
                        tooltipDiv.style.zIndex = '1000';
                        tooltipDiv.style.transition = 'all 0.2s ease';
                      },
                      callbacks: {
                        title: (tooltipItems) => {
                          return tooltipItems[0].label || 'Price';
                        },
                        label: (context) => {
                          let label = '';
                          const rawValue = typeof context.raw === 'number' ? context.raw : 0;

                          const formattedValue =
                            rawValue < 0.01 ? rawValue.toFixed(8) : rawValue.toFixed(4);

                          if (context.datasetIndex === 0) {
                            label = `Price: $${formattedValue}`;
                          } else if (priceHistory.length <= 3 && context.datasetIndex === 1) {
                            label = `Current Mean: $${formattedValue}`;
                          } else {
                            const percentileLabels = [
                              '25th Percentile',
                              'Median',
                              '75th Percentile',
                            ];
                            const idx = context.datasetIndex - (priceHistory.length <= 3 ? 1 : 0);
                            if (idx >= 1 && idx <= 3) {
                              label = `${percentileLabels[idx - 1]}: $${formattedValue}`;
                            }
                          }

                          return label;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      display: true,
                      ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 2,
                        font: {
                          size: 8,
                        },
                      },
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      display: false,
                    },
                  },
                  animation: false,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function calculatePriceChange(priceHistory: number[]): {
  value: number;
  percent: number;
  trend: 'up' | 'down' | 'neutral';
} | null {
  if (priceHistory.length < 2) return null;

  const prevPrice = priceHistory[priceHistory.length - 2];
  const newPrice = priceHistory[priceHistory.length - 1];

  if (prevPrice === 0) return null;
  if (prevPrice === newPrice) return null;

  const valueDiff = newPrice - prevPrice;
  const percentDiff = (valueDiff / prevPrice) * 100;

  const MIN_PRICE_CHANGE = 0.01; // 1%

  if (Math.abs(percentDiff) < MIN_PRICE_CHANGE) return null;

  const trend: 'up' | 'down' | 'neutral' =
    valueDiff > 0 ? 'up' : valueDiff < 0 ? 'down' : 'neutral';

  return {
    value: valueDiff,
    percent: percentDiff,
    trend,
  };
}

function calculatePercentile(data: number[], percentile: number): number {
  if (!data || data.length === 0) return 0;

  const sortedData = [...data].sort((a, b) => a - b);

  const index = Math.floor(percentile * sortedData.length);

  if (index >= sortedData.length) return sortedData[sortedData.length - 1];
  if (index < 0) return sortedData[0];

  return sortedData[index];
}
