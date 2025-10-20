export interface Trade {
  tradeId?: string;

  // Basic details
  symbol: string; 
  type: 'long' | 'short';
  volume: number; 

  // Entry details
  entryDate: string; 
  entryPrice: number;

  // Exit details 
  exitDate: string;
  exitPrice: number;

  // Other details
  stopLoss: number; 
  takeProfit: number;
}

export interface JournalEntryExecutionQuality {
  // Execution quality
  entryQuality: 1 | 2 | 3 | 4 | 5;        // 1=poor, 5=perfect
  exitQuality: 1 | 2 | 3 | 4 | 5;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface JournalEntryMarketContext {
  marketType?: 'trending' | 'range' | 'volatile';
  // not including time of day (open, morning, midday, afternoon, close)
  // not including catalyst 
  marketSession: 'asian' | 'london' | 'new york';
}

export interface JournalEntryResults {
  pnl: number;
  holdTime: number;
  rMultiple?: number;
}

export interface JournalEntryLearning {
  followedPlan?: boolean;
  mistakes?: string[];
  lessons?: string[];
  imageUrls?: string[];
}

export interface JournalEntry {
  journalEntryId?: string;
  setupId?: string;
  trade: Trade;
  executionQuality: JournalEntryExecutionQuality;
  marketContext: JournalEntryMarketContext;
  results: JournalEntryResults;
  learning: JournalEntryLearning;
}