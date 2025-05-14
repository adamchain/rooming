import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, DollarSign, PieChart, AlertCircle, Building2 } from 'lucide-react';
import assetAdvisorService from '../services/assetAdvisorService';
import { formatCurrency } from '../utils/formatters';
import AssetPortfolioChart from './AssetPortfolioChart';
import ProjectionChart from './ProjectionChart';

interface AssetAdvisorProps {
  currentAge?: number;
}

export default function AssetAdvisor({ currentAge = 35 }: AssetAdvisorProps) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retirementGoal, setRetirementGoal] = useState({
    targetAge: 60,
    targetIncome: 120000,
    riskTolerance: 'moderate' as const
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await assetAdvisorService.getPropertyValues();
      setProperties(data);
    } catch (err) {
      setError('Failed to load property data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const projectionData = useMemo(() => {
    if (!properties.length) return [];

    const years = retirementGoal.targetAge - currentAge;
    const appreciationRates = {
      conservative: 0.03,
      moderate: 0.05,
      aggressive: 0.07
    };
    const rate = appreciationRates[retirementGoal.riskTolerance];

    return Array.from({ length: years + 1 }, (_, i) => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + i);

      const value = properties.reduce((total, property) => {
        return total + assetAdvisorService.projectFutureValue(property, i, rate);
      }, 0);

      return { date, value };
    });
  }, [properties, retirementGoal, currentAge]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-[#0078d4] border-r-[#0078d4] border-b-transparent border-l-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  const netWorth = assetAdvisorService.calculateNetWorth(properties);
  const monthlyIncome = assetAdvisorService.calculateMonthlyIncome(properties);
  const projection = assetAdvisorService.calculateRetirementProjection(
    properties,
    retirementGoal,
    currentAge
  );
  const recommendations = assetAdvisorService.generateRecommendations(properties, retirementGoal);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth Card */}
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#0078d4]/10 rounded-full">
              <DollarSign className="h-6 w-6 text-[#0078d4]" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Net Worth</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(netWorth)}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Income Card */}
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Income</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(monthlyIncome)}
              </p>
            </div>
          </div>
        </div>

        {/* Properties Card */}
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Properties</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {properties.length}
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Diversity Card */}
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <PieChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Score</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {properties.length > 0 ? '85%' : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Portfolio Distribution
          </h2>
          <div className="h-64">
            <AssetPortfolioChart
              width={400}
              height={250}
              properties={properties}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Value Projection
          </h2>
          <div className="h-64">
            <ProjectionChart
              width={400}
              height={250}
              data={projectionData}
            />
          </div>
        </div>
      </div>

      {/* Retirement Projection */}
      <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Retirement Projection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Projected Annual Income</p>
            <p className="text-2xl font-semibold text-[#0078d4]">
              {formatCurrency(projection.projectedIncome)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Years to Goal</p>
            <p className="text-2xl font-semibold text-[#0078d4]">
              {projection.yearsToGoal}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Additional Savings Needed</p>
            <p className="text-2xl font-semibold text-[#0078d4]">
              {formatCurrency(projection.additionalSavingsNeeded)}
            </p>
          </div>
        </div>

        {/* Retirement Goal Settings */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Retirement Age
            </label>
            <input
              type="number"
              value={retirementGoal.targetAge}
              onChange={(e) => setRetirementGoal({
                ...retirementGoal,
                targetAge: parseInt(e.target.value)
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0078d4] focus:ring-[#0078d4] sm:text-sm dark:bg-[#1b1b1b] dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Annual Income
            </label>
            <input
              type="number"
              value={retirementGoal.targetIncome}
              onChange={(e) => setRetirementGoal({
                ...retirementGoal,
                targetIncome: parseInt(e.target.value)
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0078d4] focus:ring-[#0078d4] sm:text-sm dark:bg-[#1b1b1b] dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Risk Tolerance
            </label>
            <select
              value={retirementGoal.riskTolerance}
              onChange={(e) => setRetirementGoal({
                ...retirementGoal,
                riskTolerance: e.target.value as 'conservative' | 'moderate' | 'aggressive'
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0078d4] focus:ring-[#0078d4] sm:text-sm dark:bg-[#1b1b1b] dark:text-white"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recommendations
        </h2>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start p-3 bg-gray-50 dark:bg-[#1b1b1b] rounded-lg"
            >
              <AlertCircle className="h-5 w-5 text-[#0078d4] mt-0.5" />
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}