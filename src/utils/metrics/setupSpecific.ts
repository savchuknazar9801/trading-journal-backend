import { Request } from 'express';
import { fetchSetupTrades } from '../fetchSetupTrades.js';
import { Trade } from '../../types/journal.js';
import { calculatePnL } from '../calculatePnL.js';
import { HourlyStats } from '../../types/performanceMetrics.js';

export const getCoreMetrics = async (req: Request, setupId: string) => {

  // Get all the trades of this specific strategy 
  const trades: Trade[] = await fetchSetupTrades(req, setupId);

  // pre-calculating all commonly used values
  const numOfTrades = trades.length;

  const { numOfWins, numOfLosses, sumOfWins, sumOfLosses } = trades.reduce((acc: { numOfWins: number, numOfLosses: number, sumOfWins: number, sumOfLosses: number }, trade: Trade) => {
    const { symbol, entryPrice, exitPrice, volume, type } = trade;
    const pnl = calculatePnL(symbol, entryPrice, exitPrice, volume, type);

    return {
      numOfWins: pnl > 0 ? acc.numOfWins + 1 : acc.numOfWins,
      numOfLosses: pnl < 0 ? acc.numOfLosses + 1 : acc.numOfLosses,
      sumOfWins: pnl > 0 ? acc.sumOfWins + pnl : acc.sumOfWins,
      sumOfLosses: pnl < 0 ? acc.sumOfLosses + pnl : acc.sumOfLosses
    }
  }, { numOfWins: 0, numOfLosses: 0, sumOfWins: 0, sumOfLosses: 0});


  return {
    getTotalTrades () {
      return numOfTrades;
    },

    getWinRate () {
      return numOfWins > 0 ? numOfWins / numOfTrades : 0; 
    },

    getAvgWin () {
      return numOfWins > 0 ? sumOfWins / numOfWins : 0; 
    },

    getAvgLoss () {
      return numOfLosses > 0 ? sumOfLosses / numOfLosses : 0;
    },

    getAvgRRR () {
      // Calculate R-multiple for each trade
      const rMultiples = trades.map((trade) => {
        const risk = Math.abs(trade.entryPrice - trade.stopLoss);
        const pnl = trade.type === 'long' 
          ? trade.exitPrice - trade.entryPrice
          : trade.entryPrice - trade.exitPrice;

        // flag it as null (we'll remove this later to avoid bad data)
        if (risk === 0) return null;

        return pnl / risk;      // R-multiple of the trade
      })
      .filter((rMultiple) => rMultiple !== null);

      // Average all of them (including error checking in the case it's all been filtered out)
      const avgRRR = rMultiples.length > 0 
        ? rMultiples.reduce((sum, rMultiple) => sum + rMultiple, 0) / rMultiples.length
        : 0;

      return avgRRR;
    },

    getProfitFactor () {
      if (sumOfLosses === 0) {
        return sumOfWins > 0 ? Infinity : 0;  // if no wins & no loss
      }

      return sumOfWins / Math.abs(sumOfLosses);
    },

    getExpectancy () {
      const winRate = numOfWins / numOfTrades;
      const avgWin = numOfWins > 0 ? sumOfWins / numOfWins : 0;
      const lossRate = numOfLosses / numOfTrades;
      const avgLoss = numOfLosses > 0 ? sumOfLosses / numOfLosses : 0;

      return (winRate * avgWin) - (Math.abs(lossRate * avgLoss));
    },

    getTotalPnl () {
      return sumOfWins + sumOfLosses;
    }
  };
};

export const getConsistencyMetrics = async (req: Request, setupId: string) => {

  const trades: Trade[] = await fetchSetupTrades(req, setupId);

  // Sorted trades (will be used for streak calculation)
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.exitDate).getTime() - new Date(b.exitDate).getTime()
  );

  return {
    getBestStreak () {
      // Track current and best streak 
      let currentStreak = 0;
      let bestStreak = 0;

      sortedTrades.forEach((trade) => {
        const { symbol, entryPrice, exitPrice, volume, type } = trade;
        const pnl = calculatePnL(symbol, entryPrice, exitPrice, volume, type);

        if (pnl > 0) {
          // Winning trade - increment streak 
          currentStreak++;
          bestStreak = Math.max(bestStreak, currentStreak);
        } else {
          // Losing or breakeven trade - reset streak
          currentStreak = 0;
        }
      });

      return bestStreak;
    },

    getWorstStreak () {
      // Track current and worst streak
      let currentStreak = 0;
      let worstStreak = 0;

      sortedTrades.forEach((trade) => {
        const { symbol, entryPrice, exitPrice, volume, type } = trade;
        const pnl = calculatePnL(symbol, entryPrice, exitPrice, volume, type);

        if (pnl < 0) {
          // Losing trade - increment streak
          currentStreak++;
          worstStreak = Math.max(worstStreak, currentStreak);
        } else {
          // Winning or breakeven trade - reset streak
          currentStreak = 0;
        }
      });

      return worstStreak;
    },

    getStdDeviation () {
      // Calculate average pnl
      const pnls = trades.map((trade) => {
        const { symbol, entryPrice, exitPrice, volume, type } = trade;
        return calculatePnL(symbol, entryPrice, exitPrice, volume, type);
      });
      
      const avgPnl = pnls.reduce((sum, pnl) => sum + pnl, 0) / pnls.length; 

      // Calculate variance (average of squared differences)
      const variance = pnls.reduce((sum, pnl) => {
        const difference = pnl - avgPnl; 
        return sum + (difference * difference);
      }, 0) / pnls.length;

      // Return std deviation (square root of variance)
      return Math.sqrt(variance);
    },

    // How often you hit profit target (or stop loss)
    getHitRate () {
      const results = sortedTrades.map((trade) => {
        const { type, entryPrice, exitPrice, stopLoss, takeProfit } = trade;

        // Calculate planned risk and reward 
        const risk = Math.abs(entryPrice - stopLoss);
        const plannedReward = Math.abs(takeProfit - entryPrice);
        const actualReward = type === 'long'
          ? exitPrice - entryPrice
          : entryPrice - exitPrice;

        // Categorize trade
        if (actualReward >= plannedReward * 0.9) {
          return 'fullTarget';
        } else if (actualReward >= plannedReward * 0.5) {
          return 'halfTarget';
        } else if (actualReward <= (-risk) * 0.9) {
          return 'stopped';
        } else {
          return 'earlyExit';
        }
      });

      // Calculate percentages
      const total = results.length; 
      return {
        fullTarget: results.filter((res) => res === 'fullTarget').length / total,
        halfTarget: results.filter((res) => res === 'halfTarget').length / total,
        stopped: results.filter((res) => res === 'stopped').length / total,
        earlyExit: results.filter((res) => res === 'earlyExit').length / total
      }
    }
  };
};

export const getExecutionQualityMetrics = async (req: Request, setupId: string) => {
  // Initialise all strategy trades 
  const trades: Trade[] = await fetchSetupTrades(req, setupId);

  // Helper function to group trades by hour 
  const groupTradesByHour = (trades: Trade[]) => {
    const hourlyStats: Record<string, HourlyStats> = { };

    trades.forEach((trade) => {
      // Getting hour and padding if single digit with '0'
      const hour = new Date(trade.entryDate).getHours();
      const hourKey = hour.toString().padStart(2, '0');

      if (!hourlyStats[hourKey]) {
        hourlyStats[hourKey] = {
          numOfTrades: 0,
          numOfWins: 0,
          numOfLosses: 0,
          totalPnl: 0,
          sumOfWins: 0,
          sumOfLosses: 0
        };
      }

      // Modifying stats (based on the new trade)
      const { symbol, entryPrice, exitPrice, volume, type } = trade;
      const pnl = calculatePnL(symbol, entryPrice, exitPrice, volume, type);

      hourlyStats[hourKey].numOfTrades++;
      hourlyStats[hourKey].totalPnl += pnl;

      if (pnl > 0) {
        hourlyStats[hourKey].numOfWins++;
        hourlyStats[hourKey].sumOfWins += pnl;
      } else if (pnl < 0) {
        hourlyStats[hourKey].numOfLosses++;
        hourlyStats[hourKey].sumOfLosses += pnl;
      }
    });

    return hourlyStats;
  }

  return {
    getAvgEntryEfficiency () {
      // Not implemented for now
    },

    getAvgExitEfficiency () {
      // Not implemented for now
    },

    getAvgHoldTime () {
      // Mapping hold times in minutes
      const holdTimes = trades.map((trade) => {
        const entryTime = new Date(trade.entryDate);
        const exitTime = new Date(trade.exitDate);

        // Calculate difference in milliseconds 
        const holdTimeMs = exitTime.getTime() - entryTime.getTime();

        // Convert to minutes
        const holdTimeMinutes = holdTimeMs / (1000 * 60);

        return holdTimeMinutes;
      });

      const avgMinutes = holdTimes.reduce((sum, time) => sum + time, 0) / holdTimes.length;

      return avgMinutes;
    },

    getBestTimeOfDay () {
      // Group trades by hour
      const hourlyStats = groupTradesByHour(trades);

      // Find the best hour by profit factor or win rate 
      const sortedHours = Object.entries(hourlyStats)
        .filter(([_, stats]) => stats.numOfTrades >= 5) // Min 5 trades for reliability
        .sort((a, b) => {
          // Sort by profit factor (total profit / total loss)
          const pfA = a[1].totalPnl / Math.max(1, Math.abs(a[1].sumOfLosses));
          const pfB = b[1].totalPnl / Math.max(1, Math.abs(b[1].sumOfLosses));
          return pfB - pfA;
        })

      if (sortedHours.length === 0) return null;

      const [bestHour, stats] = sortedHours[0];

      return {
        hour: `${bestHour}:00`,
        trades: stats.numOfTrades,
        winRate: stats.numOfWins / stats.numOfTrades,
        avgPnl: stats.totalPnl / stats.numOfTrades,
        totalPnl: stats.totalPnl
      };
    },

    getWorstTimeOfDay () {
      // Group trades by hour
      const hourlyStats = groupTradesByHour(trades);

      // Find the best hour by profit factor or win rate 
      const sortedHours = Object.entries(hourlyStats)
        .filter(([_, stats]) => stats.numOfTrades >= 5) // Min 5 trades for reliability
        .sort((a, b) => {
          // Sort by profit factor (total profit / total loss)
          const pfA = a[1].totalPnl / Math.max(1, Math.abs(a[1].sumOfLosses));
          const pfB = b[1].totalPnl / Math.max(1, Math.abs(b[1].sumOfLosses));
          return pfA - pfB;
        })

      if (sortedHours.length === 0) return null;

      const [worstHour, stats] = sortedHours[0];

      return {
        hour: `${worstHour}:00`,
        trades: stats.numOfTrades,
        winRate: stats.numOfWins / stats.numOfTrades,
        avgPnl: stats.totalPnl / stats.numOfTrades,
        totalPnl: stats.totalPnl
      };
    }
  }
};