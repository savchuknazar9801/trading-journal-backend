export interface User {
    userId: string;
    name: string; 
    email: string; 
    subscription: 'free' | 'pro' | 'elite';
    // Non-mandatory fields
    photo?: string[];
    // MT5 integration 
    metaApi: {
        MT5Accounts: MT5Account[];
    }
}

export interface Trade {
    tradeId: string;
    positionId?: string;
    strategyId: string;                                 // Every trade must be linked to a strategy
    symbol: string;                                     // Trade Parameters
    direction: 'buy' | 'sell';
    size: number;
    entryDate: string;                                  // Time & Session 
    exitDate: string; 
    session?: string;
    entryPrice: number;                             
    exitPrice: number; 
    pips?: number; 
    stopLoss: number;                                   // Risk parameters
    takeProfit: number;
    notes?: string                                      // Trade Analysis
    imageUrls?: string[];                                
    tags?: string[];
}

export interface Strategy {
    strategyId: string;
    name: string; 
    entryStrategy: string; 
    holdingStrategy: string; 
    exitStrategy: string;
    totalPnL?: number;
    imageUrls?: string[];
}

export interface TradingPlan {
    tradingPlanId: string;
    session: string; 
    currencyPair: string[];
    strategies: string[];
}

export interface MT5Account {
    accountNumber: string;
    brokerServer: string; 
    investorPassword: string; 
    metaApiAccountId: string;
    status: 'DEPLOYED' | 'UNDEPLOYED' | 'DEPLOYING' | 'UNDEPLOYING'
}