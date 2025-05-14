import { supabase } from '../lib/supabase';

interface PropertyValue {
  id: string;
  purchasePrice: number;
  currentValue: number;
  monthlyRent: number;
  expenses: number;
  mortgage: {
    balance: number;
    rate: number;
    term: number;
    payment: number;
  };
}

interface RetirementGoal {
  targetAge: number;
  targetIncome: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

class AssetAdvisorService {
  async getPropertyValues(): Promise<PropertyValue[]> {
    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          id,
          purchase_price,
          current_value,
          monthly_rent,
          expenses,
          mortgage:property_mortgages(
            balance,
            rate,
            term,
            payment
          )
        `);

      if (error) throw error;
      return properties || [];
    } catch (error) {
      console.error('Error fetching property values:', error);
      throw new Error('Failed to fetch property values');
    }
  }

  calculateNetWorth(properties: PropertyValue[]): number {
    return properties.reduce((total, property) => {
      const equity = property.currentValue - (property.mortgage?.balance || 0);
      return total + equity;
    }, 0);
  }

  calculateMonthlyIncome(properties: PropertyValue[]): number {
    return properties.reduce((total, property) => {
      const netIncome = property.monthlyRent - property.expenses - (property.mortgage?.payment || 0);
      return total + netIncome;
    }, 0);
  }

  calculateCapRate(property: PropertyValue): number {
    const annualNOI = (property.monthlyRent - property.expenses) * 12;
    return (annualNOI / property.currentValue) * 100;
  }

  calculateROI(property: PropertyValue): number {
    const annualNOI = (property.monthlyRent - property.expenses) * 12;
    const totalInvestment = property.purchasePrice;
    return (annualNOI / totalInvestment) * 100;
  }

  projectFutureValue(property: PropertyValue, years: number, appreciationRate: number): number {
    return property.currentValue * Math.pow(1 + appreciationRate, years);
  }

  calculateRetirementProjection(
    properties: PropertyValue[],
    goal: RetirementGoal,
    currentAge: number
  ): {
    projectedIncome: number;
    yearsToGoal: number;
    additionalSavingsNeeded: number;
  } {
    const yearsToGoal = goal.targetAge - currentAge;
    const currentMonthlyIncome = this.calculateMonthlyIncome(properties);
    const currentNetWorth = this.calculateNetWorth(properties);

    // Appreciation rates based on risk tolerance
    const appreciationRates = {
      conservative: 0.03,
      moderate: 0.05,
      aggressive: 0.07
    };

    const rate = appreciationRates[goal.riskTolerance];

    // Project future portfolio value
    const projectedValue = properties.reduce((total, property) => {
      return total + this.projectFutureValue(property, yearsToGoal, rate);
    }, 0);

    // Calculate projected monthly income
    const projectedMonthlyIncome = currentMonthlyIncome * Math.pow(1 + rate, yearsToGoal);
    const projectedAnnualIncome = projectedMonthlyIncome * 12;

    // Calculate additional savings needed
    const additionalSavingsNeeded = Math.max(
      0,
      (goal.targetIncome - projectedAnnualIncome) * 25 // Using 4% withdrawal rate
    );

    return {
      projectedIncome: projectedAnnualIncome,
      yearsToGoal,
      additionalSavingsNeeded
    };
  }

  generateRecommendations(
    properties: PropertyValue[],
    goal: RetirementGoal
  ): string[] {
    const recommendations: string[] = [];
    
    // Analyze portfolio performance
    properties.forEach(property => {
      const capRate = this.calculateCapRate(property);
      const roi = this.calculateROI(property);

      if (capRate < 5) {
        recommendations.push(`Consider strategies to improve cash flow for property ${property.id} (Cap Rate: ${capRate.toFixed(2)}%)`);
      }

      if (roi < 8) {
        recommendations.push(`Evaluate potential value-add opportunities for property ${property.id} to improve ROI`);
      }
    });

    // Portfolio diversification
    if (properties.length < 3) {
      recommendations.push('Consider expanding your portfolio to improve diversification');
    }

    // Debt optimization
    properties.forEach(property => {
      if (property.mortgage && property.mortgage.rate > 5) {
        recommendations.push(`Explore refinancing options for property ${property.id} to reduce interest expenses`);
      }
    });

    // Risk management
    const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
    properties.forEach(property => {
      const concentration = (property.currentValue / totalValue) * 100;
      if (concentration > 40) {
        recommendations.push(`High portfolio concentration (${concentration.toFixed(2)}%) in property ${property.id}. Consider diversification.`);
      }
    });

    return recommendations;
  }
}

export default new AssetAdvisorService();