import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, Building2, Calendar, AlertTriangle } from 'lucide-react';
import invoiceService from '../services/invoiceService';
import paymentService from '../services/paymentService';
import { formatCurrency } from '../utils/formatters';

interface Invoice {
  id: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
  total: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  tenant: {
    name: string;
    email: string;
  };
  property: {
    name: string | null;
    address: string;
  };
}

export default function PaymentLink() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (paymentId) {
      loadInvoice(paymentId);
    }
  }, [paymentId]);

  const loadInvoice = async (id: string) => {
    try {
      const data = await invoiceService.getInvoiceByPaymentId(id);
      setInvoice(data);
    } catch (err) {
      setError('Invoice not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!invoice) return;

    try {
      setProcessing(true);
      setError(null);

      // Initialize GETTRX checkout
      const trx = window.TRX('pk_rW2wp1rnulRnx7oJQN8V_L-qEplUMSdm-eBQ1R24BkmW51f7ETcmpN0aUAN66dOm');
      
      const { token } = await trx.createToken({
        mode: 'payment',
        currency: 'usd',
        amount: invoice.total * 100, // Convert to cents
        paymentMethodTypes: ['card'],
        setupFutureUsage: 'off_session',
        onBehalfOf: 'acm_67c1039bd94d3f0001ee9801'
      });

      // Create customer
      const customer = await paymentService.createCustomer(invoice.tenant.name);

      // Process the payment
      await paymentService.createPayment(invoice.total, token);

      // Update invoice status
      await invoiceService.updateInvoiceStatus(invoice.id, 'paid');

      // Show success message
      alert('Payment processed successfully!');
      
      // Reload invoice to show updated status
      await loadInvoice(paymentId!);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h1 className="text-xl font-semibold text-center mb-2">Invoice Not Found</h1>
          <p className="text-gray-600 text-center">
            The payment link you're trying to access is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Payment Details</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                invoice.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : invoice.status === 'overdue'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <Building2 className="h-6 w-6 text-gray-400 mt-1" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Property</h3>
                  <p className="text-sm text-gray-500">
                    {invoice.property.name || invoice.property.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-6 w-6 text-gray-400 mt-1" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Due Date</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h3>
                <div className="space-y-4">
                  {invoice.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{item.description}</span>
                      <span className="text-gray-900">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(invoice.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {invoice.status === 'pending' && (
              <>
                {error && (
                  <div className="mt-6 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                      processing
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {processing ? 'Processing...' : `Pay ${formatCurrency(invoice.total)}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}