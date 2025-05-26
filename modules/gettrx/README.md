# GetTRX Payment Processing Tool

A comprehensive payment processing solution that integrates with the GetTRX payment platform. This tool provides separate interfaces for landlords (merchants) to manage and accept payments, and for tenants (customers) to make payments.

## Features

- **Landlord (Merchant) Interface**
  - Authentication and account management
  - Transaction history and reporting
  - Payment acceptance
  - Customer management

- **Tenant (Customer) Interface**
  - Easy payment processing
  - Payment method saving for future payments
  - Transaction history

## Integration Guide

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Existing Vite React project

### Installation Steps

1. **Clone or download this repository**

2. **Copy the source files to your existing project**
   - Copy the `src/components/gettrx` directory to your project's src/components directory
   - Copy the `src/services` directory to your project
   - Copy the `src/pages/gettrx` directory to your project's pages directory

3. **Install required dependencies**
   ```bash
   npm install react-router-dom axios
   # or
   yarn add react-router-dom axios
   ```

4. **Update your routing configuration**
   Add the following routes to your main router configuration:

   ```tsx
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   import LandlordDashboard from './pages/gettrx/landlord/Dashboard';
   import LandlordLogin from './pages/gettrx/landlord/Login';
   import TenantPayment from './pages/gettrx/tenant/Payment';
   
   function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/landlord" element={<LandlordDashboard />} />
           <Route path="/landlord/login" element={<LandlordLogin />} />
           <Route path="/tenant/payment" element={<TenantPayment />} />
           {/* Your existing routes */}
         </Routes>
       </BrowserRouter>
     );
   }
   ```

5. **Configure environment variables**
   Create or update your `.env` file with the following variables:

   ```
   VITE_GETTRX_PUBLIC_KEY=pk_rW2wp1rnulRnx7oJQN8V_L-qEplUMSdm-eBQ1R24BkmW51f7ETcmpN0aUAN66dOm
   VITE_GETTRX_SECRET_KEY=sk_gDOd9rcdoq89j8iIatmQ7nPy8L4G3ebZ9Q4sZH4tiswkVHDorvdQ-SP3IpjN-lMw
   VITE_GETTRX_MERCHANT_ID_1=acm_67c1039bd94d3f0001ee9801
   VITE_GETTRX_MERCHANT_ID_2=acm_67c103e6d94d3f0001ee9805
   VITE_GETTRX_API_URL=https://api-dev.gettrx.com
   ```

6. **Import the GetTRX script in your index.html**
   Add the following script tag to your index.html file:

   ```html
   <script src="https://js-dev.gettrx.com/v1"></script>
   ```

7. **Start your development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Usage

### Landlord (Merchant) Interface

1. Navigate to `/landlord/login` to access the landlord login page
2. Sign in with your merchant credentials
3. View the dashboard to see transaction history and manage payments
4. Process payments on behalf of customers or set up payment forms

### Tenant (Customer) Interface

1. Navigate to `/tenant/payment` to access the payment page
2. Enter payment details (credit card, bank account)
3. Submit payment or save payment method for future use
4. View transaction status and history

## Security Considerations

- Never expose your Secret Key on the client-side
- Use server-side endpoints for processing payments
- Implement proper authentication and authorization
- Follow PCI compliance guidelines

## Sandbox Testing

This integration is configured to use GetTRX sandbox credentials. For testing purposes, you can use the following test cards:

- **Successful Payment**: 4242 4242 4242 4242
- **Payment Failure**: 4000 0000 0000 0002

For more test cards and scenarios, see the [GetTRX testing documentation](https://docs.gettrx.com/docs/testing-your-integration).

## Production Deployment

When moving to production:

1. Replace sandbox credentials with production credentials
2. Update the script source in index.html to use the production URL
3. Update the API URL in your environment variables
4. Perform thorough testing with live credentials