export interface Property {
  id: string;
  name: string;
  address: string;
  purchasePrice: number;
  purchaseDate: string;
  currentValue: number;
  monthlyRent: number;
  expenses: {
    mortgage: number;
    taxes: number;
    insurance: number;
    maintenance: number;
  };
}

export interface FinancialGoal {
  id: string;
  type: 'retirement' | 'acquisition' | 'netWorth';
  targetAmount: number;
  targetDate: string;
  currentProgress: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  properties: Property[];
  financialGoals: FinancialGoal[];
  otherAssets: {
    stocks: number;
    bonds: number;
    cash: number;
  };
}