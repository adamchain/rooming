// src/Callback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { unregisterAllServiceWorkers, clearSiteData } from './utils/serviceWorkerUtils'

const Callback: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Unregister service workers to prevent interference
        unregisterAllServiceWorkers();
        clearSiteData();

        const processCallback = async () => {
            try {
                // Parse URL parameters
                const searchParams = new URLSearchParams(location.search);
                const code = searchParams.get('code');
                const realmId = searchParams.get('realmId');
                const errorParam = searchParams.get('error');

                if (errorParam) {
                    const errorDesc = searchParams.get('error_description') || 'Unknown error';
                    setError(`Authentication error: ${errorDesc}`);
                    return;
                }

                if (!code) {
                    setError('No authorization code received');
                    return;
                }

                // Store realmId in localStorage
                if (realmId) {
                    localStorage.setItem('quickbooks_realm_id', realmId);
                }

                setStatus('Exchanging authorization code for token...');

                // Call your backend to exchange the code for a token
                const response = await fetch('http://localhost:3000/api/quickbooks/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, realmId }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Server error: ${response.status} ${errorText}`);
                }

                const data = await response.json();

                if (!data.access_token) {
                    throw new Error('No access token received from server');
                }

                // Store the token
                localStorage.setItem('quickbooks_token', data.access_token);

                if (data.refresh_token) {
                    localStorage.setItem('quickbooks_refresh_token', data.refresh_token);
                }

                setStatus('Connected successfully!');

                // Redirect to home page after a short delay
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } catch (err) {
                console.error('Callback processing error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
            }
        };

        processCallback();
    }, [location, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                {!error ? (
                    <>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-4"></div>
                        <h1 className="text-xl font-bold mb-2">QuickBooks Authentication</h1>
                        <p className="text-gray-600">{status}</p>
                    </>
                ) : (
                    <>
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h1 className="text-xl font-bold mb-2">Connection Error</h1>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                        >
                            Return to Dashboard
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Callback;