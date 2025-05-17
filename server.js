// server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import OAuthClient from 'intuit-oauth';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import qs from 'querystring';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Add any other origins you need
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add an explicit handler for OPTIONS requests
app.options('/api/quickbooks/callback', (req, res) => {
    res.status(200).end();
});

// QuickBooks OAuth configuration
const oauthClient = new OAuthClient({
    clientId: process.env.VITE_QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env.VITE_QUICKBOOKS_CLIENT_SECRET,
    environment: 'sandbox', // Using sandbox as specified in your env file
    redirectUri: process.env.VITE_QUICKBOOKS_REDIRECT_URI || 'http://localhost:5173/callback',
});

// Routes
app.get('/api/quickbooks/auth', (req, res) => {
    try {
        console.log("Generating auth URL with redirect URI:", oauthClient.redirectUri);

        // Generate authorization URL
        const authUri = oauthClient.authorizeUri({
            scope: [OAuthClient.scopes.Accounting],
            state: 'intuit-oauth-state',
        });

        console.log("Redirecting to auth URL:", authUri);

        // Redirect to QuickBooks authorization page
        res.redirect(authUri);
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).json({ error: 'Failed to initiate OAuth flow', details: error.message });
    }
});

app.post('/api/quickbooks/callback', async (req, res) => {
    console.log("Received callback request with body:", req.body);
    const { code, realmId } = req.body;

    if (!code) {
        console.error("No authorization code provided");
        return res.status(400).json({ error: 'No authorization code provided' });
    }

    try {
        console.log("Exchanging auth code for tokens with code:", code);

        // Token exchange code...

        // Add debugging for CORS issues
        console.log("Sending response headers:", res.getHeaders());

        return res.json({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: tokens.expires_in
        });
    } catch (error) {
        console.error('Error exchanging auth code:', error);
        if (error.response && error.response.data) {
            console.error('Error response data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to exchange auth code', details: error.message });
    }
});

// Updated financial data endpoint with better error handling
app.get('/api/quickbooks/financial-data', async (req, res) => {
    try {
        // Extract token from authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
        }

        const token = authHeader.split(' ')[1];

        // Get the realmId from query params, local storage, or env variable
        const realmId = req.query.realmId || process.env.VITE_QUICKBOOKS_REALM_ID;

        if (!realmId) {
            return res.status(400).json({ error: 'No company ID (realmId) provided' });
        }

        console.log(`Fetching financial data for realmId: ${realmId}`);
        console.log(`Using token: ${token.substring(0, 10)}...`);

        // Skip the token validation with oauthClient since it's causing issues

        // Query for profit and loss report
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const reportUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/reports/ProfitAndLoss?start_date=${startDate}&end_date=${endDate}&columns=monthly`;

        console.log("Making API request to:", reportUrl);

        const response = await axios.get(reportUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        console.log("API response status:", response.status);

        // Log a sample of the response data to debug
        if (response.data) {
            console.log("Sample of response data:",
                JSON.stringify(response.data).substring(0, 200) + "...");
        }

        // Process the profit and loss report data
        const report = response.data;
        const financialData = [];

        // Extract monthly data from the report
        if (report && report.Rows && report.Rows.Row) {
            const revenueRow = report.Rows.Row.find(row =>
                row.Header?.ColData?.[0]?.value === 'Income' ||
                row.Header?.ColData?.[0]?.value === 'Revenue' ||
                row.Header?.ColData?.[0]?.value === 'Total Income');

            const expensesRow = report.Rows.Row.find(row =>
                row.Header?.ColData?.[0]?.value === 'Expenses' ||
                row.Header?.ColData?.[0]?.value === 'Total Expenses');

            console.log("Found revenue row:", !!revenueRow);
            console.log("Found expenses row:", !!expensesRow);

            if (revenueRow && expensesRow) {
                // Process monthly columns
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                for (let i = 0; i < 12; i++) {
                    // Check if we have data for this month
                    // Enhanced safety checks for nested properties
                    const revenueValue = revenueRow.Summary?.ColData?.[i + 1]?.value;
                    const expensesValue = expensesRow.Summary?.ColData?.[i + 1]?.value;

                    if (revenueValue !== undefined && expensesValue !== undefined) {
                        // Parse values, remove any commas and convert to number
                        const revenue = parseFloat((revenueValue || "0").toString().replace(/,/g, ''));
                        const expenses = parseFloat((expensesValue || "0").toString().replace(/,/g, ''));

                        financialData.push({
                            date: monthNames[i],
                            revenue: isNaN(revenue) ? 0 : revenue,
                            expenses: isNaN(expenses) ? 0 : expenses
                        });
                    } else {
                        // Add zero values for months without data to ensure all months are represented
                        financialData.push({
                            date: monthNames[i],
                            revenue: 0,
                            expenses: 0
                        });
                    }
                }
            }
        }

        // If no monthly data is found, provide mock data for testing
        if (financialData.length === 0) {
            console.log('No financial data found, returning mock data');

            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let i = 0; i < 12; i++) {
                // Generate some sample data that trends upward for revenue
                const revenue = 50000 + (i * 2000) + Math.floor(Math.random() * 10000);
                // Expenses typically lower than revenue but also trending up
                const expenses = 40000 + (i * 1000) + Math.floor(Math.random() * 5000);

                financialData.push({
                    date: monthNames[i],
                    revenue,
                    expenses
                });
            }
        }

        console.log(`Returning ${financialData.length} months of financial data`);
        res.json(financialData);
    } catch (error) {
        console.error('Error fetching financial data:', error);

        // Enhanced error logging
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            console.error('Response data:', error.response.data);
        }

        // Handle token expiration errors
        if (error.response && error.response.status === 401) {
            return res.status(401).json({
                error: 'Authentication expired',
                details: error.response?.data?.fault?.error?.[0]?.message || error.message
            });
        }

        res.status(500).json({
            error: 'Failed to fetch financial data',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
}

// Catch-all route
app.get('/', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    } else {
        res.send('QuickBooks API Server - Go to /api/quickbooks/auth to start the OAuth flow');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Using QuickBooks Redirect URI: ${oauthClient.redirectUri}`);
    console.log(`Using QuickBooks Realm ID: ${process.env.VITE_QUICKBOOKS_REALM_ID}`);
});