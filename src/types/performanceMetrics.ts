interface SetupMetrics {
  // 1. CORE PERFORMANCE METRICS
  performance: {
    totalTrades: number;              // Need minimum 20 for reliability
    winRate: number;                  // Win % - your north star metric
    avgWin: number;                   // Average winning trade $
    avgLoss: number;                  // Average losing trade $
    avgRRR: number;                   // Average Risk/Reward Ratio achieved
    profitFactor: number;             // Total wins $ / Total losses $
    expectancy: number;               // Expected $ per trade
    totalPnL: number;                 // Total profit/loss for this setup
  };

  // 2. CONSISTENCY METRICS
  consistency: {
    bestStreak: number;               // Longest winning streak
    worstStreak: number;              // Longest losing streak
    stdDeviation: number;             // Consistency of returns
    hitRate: {                        // How often you hit targets
      fullTarget: number;             // % hitting full profit target (90%+)
      halfTarget: number;             // % hitting at least 50% of target
      stopped: number;                // % hitting stop loss (90%)
      earlyExit: number;              // % of early exits (closed too early)
    };
  };

  // 3. EXECUTION QUALITY
  execution: {
    avgEntryEfficiency: number;       // How close to ideal entry (0-100%)
    avgExitEfficiency: number;        // How close to ideal exit (0-100%)
    avgHoldTime: number;             // Average minutes/hours in trade
    bestTimeOfDay: string;           // When this setup works best
    worstTimeOfDay: string;          // When to avoid this setup
  };

  // 4. MARKET CONTEXT
  marketContext: {
    trendingMarket: {                // Performance in trending markets
      trades: number;
      winRate: number;
      avgPnL: number;
    };
    rangeMarket: {                   // Performance in range/chop
      trades: number;
      winRate: number;
      avgPnL: number;
    };
    volatility: {
      lowVol: { trades: number; winRate: number };
      highVol: { trades: number; winRate: number };
    };
  };

  // 5. TRADE QUALITY DISTRIBUTION
  gradeDistribution: {
    "A+": number;                    // Perfect execution trades
    "A": number;                     // Great trades
    "B": number;                     // Good trades
    "C": number;                     // Mediocre trades
    "D": number;                     // Poor trades
    "F": number;                     // Should not have taken
  };

  // 6. KEY INSIGHTS
  insights: {
    edge: string;                    // What's your edge with this setup?
    bestConditions: string[];        // When does it work best?
    avoidWhen: string[];            // Red flags to avoid
    improvementAreas: string[];      // What to work on
  };
}

export interface HourlyStats {
  numOfTrades: number; 
  numOfWins: number;
  numOfLosses: number;
  totalPnl: number;
  sumOfWins: number;
  sumOfLosses: number;
}