import React, { useState, useEffect } from 'react';
import { Building2, DollarSign, TrendingUp, PieChart, AlertCircle } from 'lucide-react';
import assetAdvisorService from '../services/assetAdvisorService';
import { formatCurrency } from '../utils/formatters';
import AssetPortfolioChart from '../components/AssetPortfolioChart';
import ProjectionChart from '../components/ProjectionChart';

export default function AssetManager() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retirementGoal, setRetirementGoal] = useState({
    targetAge: 60,
    targetIncome: 120000,
    riskTolerance: 'moderate' as const
  });
  const currentAge = 35;

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
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Asset Manager</h1>

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
              data={properties.map((p, i) => ({
                date: new Date(Date.now() + i * 365 * 24 * 60 * 60 * 1000),
                value: p.currentValue * Math.pow(1.05, i)
              }))}
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Property Details
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3b3b3b]">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Monthly Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ROI
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#252525] divide-y divide-gray-200 dark:divide-[#3b3b3b]">
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {property.name || property.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(property.purchasePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(property.currentValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(property.monthlyRent - property.expenses)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {assetAdvisorService.calculateROI(property).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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