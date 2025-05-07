import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, AlertTriangle } from 'lucide-react';
import tenantInviteService from '../services/tenantInviteService';

interface TenantInvite {
  id: string;
  name: string;
  email: string;
  status: string;
  property?: {
    name: string | null;
    address: string;
  };
}

export default function TenantInvite() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<TenantInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      loadInvite(token);
    }
  }, [token]);

  const loadInvite = async (inviteToken: string) => {
    try {
      const data = await tenantInviteService.getInviteByToken(inviteToken);
      if (!data) {
        setError('Invalid or expired invite');
      } else if (data.status !== 'pending') {
        setError('This invite has already been used or has expired');
      } else {
        setInvite(data);
        setFormData(prev => ({ ...prev, email: data.email }));
      }
    } catch (err) {
      setError('Failed to load invite');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setError(null);

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      await tenantInviteService.acceptInvite(token, {
        email: formData.email,
        password: formData.password,
      });

      setSuccess(true);
      navigate('/tenant/dashboard');
    } catch (err) {
      setError('Failed to accept invite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h1 className="text-xl font-semibold text-center mb-2">Invalid Invite</h1>
          <p className="text-gray-600 text-center">
            {error || 'This invite link is invalid or has expired.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Building2 className="h-12 w-12 text-indigo-600" />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">Welcome {invite.name}!</h1>
        <p className="text-gray-600 text-center mb-6">
          You've been invited to join{' '}
          {invite.property?.name || invite.property?.address}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}