// Update the Rent section in TenantDashboard.tsx
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

export default