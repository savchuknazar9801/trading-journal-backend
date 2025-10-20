export interface MetatraderDeal {
  id: string;
  platform: 'mt5' | 'mt4';
  type: 'DEAL_TYPE_BUY' | 'DEAL_TYPE_SELL' | 'DEAL_TYPE_BALANCE';
  time: string;
  brokerTime: string;
  commission: number;
  swap: number;
  profit: number;
  symbol?: string;
  magic: number;
  orderId?: string;
  positionId?: string;
  volume?: number;
  price?: number;
  entryType?: 'DEAL_ENTRY_IN' | 'DEAL_ENTRY_OUT';
  reason?: 'DEAL_REASON_MOBILE' | 'DEAL_REASON_SL' | 'DEAL_REASON_TP';
  stopLoss?: number;
  takeProfit?: number;
  comment?: string;
  brokerComment?: string;
  accountCurrencyExchangeRate: number;
}