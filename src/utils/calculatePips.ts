

export const calculatePips = (symbol: string, entryPrice: number, exitPrice: number, direction: 'buy' | 'sell'): number => {
  // Initialise price difference
  const priceDiff = direction === 'buy'
    ? exitPrice - entryPrice
    : entryPrice - exitPrice;

  // Get pip multiplier 
  const pipMultiplier = getPipMultiplier(symbol);

  return Number((priceDiff * pipMultiplier).toFixed(1));
}
