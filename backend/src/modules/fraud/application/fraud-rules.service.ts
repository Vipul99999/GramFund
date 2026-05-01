export interface FraudSignalInput {
  amount: number;
  rapidCountLastMinute: number;
  handlerDelayHours: number;
}

export class FraudRulesService {
  detect(input: FraudSignalInput): string[] {
    const alerts: string[] = [];
    if (input.amount >= 500000) alerts.push('HIGH_AMOUNT');
    if (input.rapidCountLastMinute > 10) alerts.push('RAPID_ACTIVITY');
    if (input.handlerDelayHours > 24) alerts.push('SETTLEMENT_DELAY');
    return alerts;
  }
}
