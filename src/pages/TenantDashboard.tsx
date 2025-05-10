import React, { useState } from 'react';
import RentPaymentForm from '../components/RentPaymentForm';

export default function TenantDashboard() {
  const [activeTab, setActiveTab] = useState('rent');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>({ property: { rent_amount: 0 } });

  const loadData = async () => {
    // TODO: Implement data loading logic
  };

  return (
    <div>
      {activeTab === 'rent' && (
        <div className="flex justify-center">
          <RentPaymentForm
            amount={data.property.rent_amount}
            onSuccess={() => {
              alert('Rent payment successful!');
              loadData();
            }}
            onError={(error) => setError(error)}
            setupRecurring
          />
        </div>
      )}
    </div>
  );
}