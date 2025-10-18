

export const calculatePips = (symbol: string, entryPrice: number, exitPrice: number, direction: 'buy' | 'sell'): number => {
  // Initialise price difference
  const priceDiff = direction === 'buy'
    ? exitPrice - entryPrice
    : entryPrice - exitPrice;

  // Get pip multiplier 
  const pipMultiplier = getPipMultiplier(symbol);

  return Number((priceDiff * pipMultiplier).toFixed(1));
}

function getPipMultiplier(symbol: string): number {
  const upperSymbol = symbol.toUpperCase();

  // Define pip multipliers
  const multipliers: Record<string, number> = {
    // JPY pairs 
    'JPY': 100,

    // Metals 
    'XAU': 10,
    'XAG': 1000,

    // Indices
    'US30': 1,
    'NAS100': 1,
    'SP500': 10,
    'DAX': 1,
    'FTSE': 1,

    // Import crypto 

    // Default for major forex 
    'DEFAULT': 10000
  };

  // Check each pattern 
  for (const [pattern, multiplier] of Object.entries(multipliers)) {
    if (upperSymbol.includes(pattern)) {
      return multiplier; 
    }
  }

  return multipliers.DEFAULT;
}