import axios from 'axios';

// Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'us_bank_account';
  last4: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  bankName?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  createdAt: string;
  paymentMethodId?: string;
  customerId?: string;
  description?: string;
}

// Window augmentation for TypeScript
declare global {
  interface Window {
    GettrxOne?: new (publicKey: string, config?: any) => {
      webElements: (options: any) => {
        create: (elementType: string, options?: any) => {
          mount: (selector: string) => void;
        };
      };
      createToken: () => Promise<{ token?: string; error?: any }>;
      on: (event: string, callback: (event: any) => void) => void;
    };
  }
}

// GetTRX API client
class GetTrxApi {
  private baseUrl: string;
  private publicKey: string;
  private secretKey: string;
  private merchantId: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_GETTRX_API_URL || 'https://api-dev.gettrx.com';
    this.publicKey = import.meta.env.VITE_GETTRX_PUBLIC_KEY || '';
    this.secretKey = import.meta.env.VITE_GETTRX_SECRET_KEY || '';
    this.merchantId = import.meta.env.VITE_GETTRX_MERCHANT_ID_1 || '';
  }

  // Get public key
  getPublicKey(): string {
    return this.publicKey;
  }

  // Set merchant ID (for switching between accounts)
  setMerchantId(merchantId: string) {
    this.merchantId = merchantId;
  }

  // Get current merchant ID
  getMerchantId() {
    return this.merchantId;
  }

  // Create headers for authenticated requests
  private getHeaders() {
    return {
      'accept': 'application/json',
      'content-type': 'application/json',
      'onBehalfOf': this.merchantId,
      'secretKey': this.secretKey
    };
  }

  // Create a customer
  async createCustomer(name: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/payments/v1/customers`,
        { name },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Process a payment
  async createPayment(
    amount: number,
    paymentToken: string,
    setupFutureUsage: boolean = false
  ): Promise<any> {
    try {
      const payload = {
        amount,
        currency: 'usd',
        paymentToken,
        ...(setupFutureUsage ? { setupFutureUsage: 'off_session' } : {})
      };

      const response = await axios.post(
        `${this.baseUrl}/payments/v1/payment-requests`,
        payload,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Process a payment using saved payment method
  async createPaymentWithSavedMethod(
    amount: number,
    paymentMethodId: string,
    customerId: string
  ): Promise<any> {
    try {
      const payload = {
        amount,
        currency: 'usd',
        paymentMethodId,
        customer: customerId
      };

      const response = await axios.post(
        `${this.baseUrl}/payments/v1/payment-requests`,
        payload,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get payment methods for a customer
  async getPaymentMethods(customerId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/v1/customers/${customerId}/payment-methods`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get a list of payments
  async getPayments(limit: number = 10, offset: number = 0): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/v1/payment-requests?limit=${limit}&offset=${offset}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get a list of customers
  async getCustomers(limit: number = 10, offset: number = 0): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/v1/customers?limit=${limit}&offset=${offset}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Handle API errors
  private handleError(error: any) {
    console.error('GetTRX API Error:', error);

    if (error.response) {
      // Server responded with an error status
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error message:', error.message);
    }
  }
}

export const gettrxApi = new GetTrxApi();

function loadGettrxSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.GettrxOne === 'function') return resolve();

    const script = document.createElement('script');
    script.src = 'https://js-dev.gettrx.com/sdk/js/payments/v1.0/sdk.js';
    script.async = true;

    script.onload = () => {
      let attempts = 0;
      const waitForGlobal = () => {
        if (typeof window.GettrxOne === 'function') return resolve();
        if (++attempts > 10) return reject(new Error('GettrxOne not available after script load'));
        setTimeout(waitForGlobal, 200);
      };
      waitForGlobal();
    };

    script.onerror = () => reject(new Error('Failed to load Gettrx SDK'));
    document.body.appendChild(script);
  });
}

let gettrxInstance: any = null;

export const initializeGetTrxElements = async (
  containerId: string,
  options: any = {}
): Promise<any> => {
  try {
    await loadGettrxSdk();

    if (typeof window.GettrxOne !== 'function') {
      throw new Error('GettrxOne SDK not loaded after script injection');
    }

    //const publicKey = gettrxApi.getPublicKey();
    const publicKey = 'pk_rW2wp1rnulRnx7oJQN8V_L-qEplUMSdm-eBQ1R24BkmW51f7ETcmpN0aUAN66dOm';

    if (!publicKey) {
      throw new Error('GetTRX public key is not available. Please check your environment variables.');
    }

    console.log('Initializing GetTRX with public key:', publicKey);

    // Initialize GettrxOne with public key
    const config = options.onBehalfOf ? { onBehalfOf: options.onBehalfOf } : undefined;
    gettrxInstance = new window.GettrxOne(publicKey, config);

    // Create webElements with options
    const webElementOptions = {
      mode: options.mode || 'payment',
      currency: options.currency || 'usd',
      amount: options.amount || '0.00',
      paymentMethodTypes: options.paymentMethodTypes || ['card'],
      setupFutureUsage: options.setupFutureUsage
    };

    const webElements = gettrxInstance.webElements(webElementOptions);

    // Create payment element
    const paymentOptions = {
      layout: 'tab',
      wallets: {
        applePay: 'auto',
        googlePay: 'auto'
      }
    };

    const paymentElement = webElements.create('payment', paymentOptions);

    // Mount the payment element to the container
    paymentElement.mount(containerId);

    return gettrxInstance;
  } catch (error) {
    console.error('Error initializing GetTRX elements:', error);
    throw error;
  }
};

export const createPaymentToken = async (): Promise<string> => {
  if (!gettrxInstance) {
    throw new Error('GetTRX instance not initialized. Call initializeGetTrxElements first.');
  }

  try {
    const result = await gettrxInstance.createToken();

    if (result.token) {
      return result.token;
    } else if (result.error) {
      console.error('Error creating payment token:', result.error);
      throw new Error(result.error.message || 'Failed to create payment token');
    } else {
      throw new Error('Unknown error creating payment token');
    }
  } catch (error) {
    console.error('Error creating payment token:', error);
    throw error;
  }
};