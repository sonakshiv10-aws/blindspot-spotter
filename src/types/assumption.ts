export interface Assumption {
  id: string;
  text: string;
  isHiddenBlindSpot: boolean;
  risk: number;
  testability: number;
  experiment: {
    name: string;
    method: string;
    cost: string;
    timeframe: string;
  };
}

export interface AnalysisData {
  firstPrinciplesInsight: string;
  assumptions: Assumption[];
}
