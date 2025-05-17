import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { unregisterAllServiceWorkers, clearSiteData } from './utils/serviceWorkerUtils';

const Callback: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Unregister service workers to prevent interference
        unregisterAllServiceWorkers();
        clearSiteData();

        const processCallback = async () => {
            try {
                console.log("Callback component mounted, URL:", location.search);
                // Parse URL parameters
                const searchParams = new URLSearchParams(location.search);
                const code = searchParams.get('code');
                const realmId = searchParams.get('realmId');
                const errorParam = searchParams.get('error');

                if (errorParam) {
                    const errorDesc = searchParams.get('error_description') || 'Unknown error';
                    setError(`Authentication error: ${errorDesc}`);
                    setIsLoading(false);
                    return;
                }

                if (!code) {
                    setError('No authorization code received');
                    setIsLoading(false);
                    return;
                }

                // Store realmId in localStorage if available
                if (realmId) {
                    localStorage.setItem('quickbooks_realm_id', realmId);
                }

                setStatus('Exchanging authorization code for token...');

                // Updated to use your local server API endpoint
                //const response = await fetch('https://rooming-qb.netlify.app/api/quickbooks/callback', {
                const response = await fetch('https://quickbooks-server-production.up.railway.app/api/quickbooks/callback', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, realmId }),
                    // Important for CORS with credentials
                    credentials: 'include'
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
                setIsLoading(false);

                // Redirect to home page after a short delay
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } catch (err) {
                console.error('Callback processing error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
                setIsLoading(false);
            }
        };

        processCallback();
    }, [location, navigate]);

    // Error display component
    const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{message}</p>
        </div>
    );

    // Loading display component
    const LoadingDisplay: React.FC = () => (
        <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                {!error ? (
                    <>
                        {isLoading && <LoadingDisplay />}
                        <h1 className="text-xl font-bold mb-2">QuickBooks Authentication</h1>
                        <p className="text-gray-600">{status}</p>
                    </>
                ) : (
                    <>
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h1 className="text-xl font-bold mb-2">Connection Error</h1>
                        <ErrorDisplay message={error} />
                        <button
                            onClick={() => navigate('/')}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 mt-4"
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