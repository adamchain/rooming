// Update the Rent tab in Financials.tsx to show merchant onboarding
{activeTab === 'rent' && (
  <div className="flex justify-center">
    {!hasMerchantAccount ? (
      <MerchantOnboarding onComplete={() => {
        setHasMerchantAccount(true);
        setShowMerchantOnboarding(false);
      }} />
    ) : (
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Merchant Account Active</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your merchant account is set up and ready to receive rent payments.
        </p>
      </div>
    )}
  </div>
)}