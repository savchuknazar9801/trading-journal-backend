

// Be more rigorous with the calculation of PnL (perhaps add a exchange rate conversion, etc.)


export const calculatePnL = (currencyPair: string, entryPrice: number, exitPrice: number, lotSize: number, type: 'long' | 'short'): number => {

    // Check if lot size is valid
    if (lotSize <= 0) {
        throw new Error('Lot size must be greater than 0');
    }

    // Check if entry and exit prices are valid
    if (entryPrice <= 0 || exitPrice <= 0) {
        throw new Error('Entry and exit prices must be greater than 0');
    }

    // Check if the direction is valid
    if (type !== 'long' && type !== 'short') {
        throw new Error('Direction must be either "long" or "short"');
    }

    // Calculate the pip value based on the lot size & the currency pair
    // Generally, for USD pairs, 1 pip = 0.0001
    // For JPY pairs, 1 pip = 0.01
    let pipValue: number;
    if (currencyPair.endsWith('JPY')) {
        pipValue = 0.01;
    } else {
        pipValue = 0.0001;
    }

    // Calculate the pips gained/lost
    let priceDiff: number; 
    if (type === 'long') {
        priceDiff = (exitPrice - entryPrice);
    } else if (type === 'short') {
        priceDiff = (entryPrice - exitPrice);
    } else {
        throw new Error('Invalid trade direction');
    }

    // Calculate the PnL in pips
    const pipsGainedOrLost = priceDiff / pipValue;
    
    // Calculate the monetary value per pip based on lot size
    // Standard lot (1.0) = $10 per pip for most USD pairs
    // Mini lot (0.1) = $1 per pip for most USD pairs
    const valuePerPip = lotSize * 10; // $10 per pip per standard lot
    
    // Calculate final PnL in dollars
    const pnl = pipsGainedOrLost * valuePerPip;

    return pnl;
};
