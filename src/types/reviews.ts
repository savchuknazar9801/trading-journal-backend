
export interface DailyReview {
  date: string; 

  // Quick Stats 
  totalTrades: number;
  winRate: number;
  pnl: number;

  // Setup Performance
  setupBreakdown: {
    [setupName: string]: {
      trades: number; 
      pnl: number;
      winRate: number;
    };
  };

  // Key Takeaways 
  whatWorked: string[];
  whatDidnt: string[];
  tomorrowsFocus: string[];

  // Grade the day
  executionGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  disciplineGrade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface WeeklySetupReview {
  weekEnding: string;

  setupRankings: Array<{
    setup: string; 
    grade: 'A+' | 'A' | 'B' | 'C' | 'F';
    numOfTrades: number;
    winRate: number;
    totalPnl: number;
    decision: 'increase-size' | 'maintain' | 'reduce-size' | 'eliminate';
  }>;

  insights: {
    bestPerformingSetup: string;
    worstPerformingSetup: string;
    mostConsistentSetup: string;
    mostImprovedSetup: string;
  };

  adjustments: string[];    // "Removing Setup X", "Sizing up on Setup Y"
}