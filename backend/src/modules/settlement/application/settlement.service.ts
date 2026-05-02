export interface SettlementInput {
  totalCollected: number;
  handlerCommission: number;
}

export interface SettlementOutput {
  totalCollected: number;
  handlerCommission: number;
  netPayout: number;
  status: 'CALCULATED';
}

export class SettlementService {
  calculate(input: SettlementInput): SettlementOutput {
    if (input.totalCollected < 0 || input.handlerCommission < 0) throw new Error('Invalid settlement values');
    return {
      totalCollected: input.totalCollected,
      handlerCommission: input.handlerCommission,
      netPayout: input.totalCollected - input.handlerCommission,
      status: 'CALCULATED'
    };
  }
}
