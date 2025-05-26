import React from 'react';
import { Building, TrendingUp, DollarSign } from 'lucide-react';

const properties = [
  {
    name: 'Riverside Apartments',
    address: '123 River St, Austin, TX',
    value: 850000,
    monthlyRent: 6500,
    roi: 9.2,
  },
  {
    name: 'Downtown Lofts',
    address: '456 Main St, Austin, TX',
    value: 1200000,
    monthlyRent: 8900,
    roi: 8.9,
  },
  {
    name: 'Sunset Complex',
    address: '789 West Ave, Austin, TX',
    value: 950000,
    monthlyRent: 7200,
    roi: 9.1,
  },
];

export function PropertyList() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Property Portfolio</h3>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Rent
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ROI
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.name} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{property.name}</div>
                      <div className="text-sm text-gray-500">{property.address}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900">
                  ${property.value.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-900">${property.monthlyRent.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="ml-1 text-sm text-gray-900">{property.roi}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}