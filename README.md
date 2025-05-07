# Rooming - Property Management System

A modern, full-featured property management system built with React, Supabase, and Tailwind CSS. Manage properties, tenants, maintenance requests, and documents all in one place.

## Features

- 🏠 **Property Management**
  - Add and manage multiple properties
  - Track property features and amenities
  - Organize property documents

- 👥 **Tenant Management**
  - Digital tenant onboarding
  - Lease tracking
  - Tenant portal access
  - Secure invite system

- 🔧 **Maintenance**
  - Create and track maintenance requests
  - Priority-based request handling
  - Status updates and history
  - Cost tracking

- 💰 **Financial Management**
  - Rent tracking
  - Invoice generation
  - Payment processing
  - Financial reporting

- 📄 **Document Management**
  - AI-powered document analysis
  - Document Q&A capabilities
  - Secure storage and organization
  - Property-specific documentation

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI Integration**: OpenAI GPT-4
- **Payment Processing**: GETTRX
- **Deployment**: Netlify

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd property-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
   VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
   VITE_TWILIO_PHONE_NUMBER=your_twilio_phone
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The application is configured for deployment on Netlify:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- `properties`: Property information
- `tenants`: Tenant details and lease information
- `maintenance_requests`: Maintenance ticket tracking
- `documents`: Document storage and analysis
- `invoices`: Payment and billing information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.