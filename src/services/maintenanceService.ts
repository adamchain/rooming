import { createClient } from '@supabase/supabase-js';

// Demo data
const DEMO_MAINTENANCE_REQUESTS = [
  {
    id: '66666666-6666-6666-6666-666666666666',
    property_id: '33333333-3333-3333-3333-333333333333',
    tenant_id: '22222222-2222-2222-2222-222222222222',
    title: 'Leaking Faucet',
    description: 'Kitchen sink faucet is dripping continuously',
    priority: 'medium',
    status: 'pending',
    estimated_cost: 150.00,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    property: {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Sunset Apartments',
      address: '123 Main Street, Apt 4B'
    },
    tenant: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'John Smith',
      email: 'tenant@test.com'
    }
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    property_id: '33333333-3333-3333-3333-333333333333',
    tenant_id: '22222222-2222-2222-2222-222222222222',
    title: 'AC Not Cooling',
    description: 'Air conditioning unit is not cooling effectively',
    priority: 'high',
    status: 'in_progress',
    estimated_cost: 350.00,
    scheduled_date: '2024-05-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    property: {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Sunset Apartments',
      address: '123 Main Street, Apt 4B'
    },
    tenant: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'John Smith',
      email: 'tenant@test.com'
    }
  }
];

class MaintenanceService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async getMaintenanceRequests() {
    // Demo mode - return mock data
    return DEMO_MAINTENANCE_REQUESTS;
  }

  async createRequest(request: any) {
    const newRequest = {
      id: crypto.randomUUID(),
      ...request,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property: {
        id: request.property_id,
        name: 'Sunset Apartments',
        address: '123 Main Street, Apt 4B'
      },
      tenant: {
        id: request.tenant_id,
        name: 'John Smith',
        email: 'tenant@test.com'
      }
    };
    DEMO_MAINTENANCE_REQUESTS.push(newRequest);
    return newRequest;
  }

  async updateMaintenanceRequest(id: string, request: any) {
    const index = DEMO_MAINTENANCE_REQUESTS.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Maintenance request not found');
    
    DEMO_MAINTENANCE_REQUESTS[index] = {
      ...DEMO_MAINTENANCE_REQUESTS[index],
      ...request,
      updated_at: new Date().toISOString()
    };
    return DEMO_MAINTENANCE_REQUESTS[index];
  }

  async deleteMaintenanceRequest(id: string) {
    const index = DEMO_MAINTENANCE_REQUESTS.findIndex(r => r.id === id);
    if (index !== -1) {
      DEMO_MAINTENANCE_REQUESTS.splice(index, 1);
    }
  }
}

export default new MaintenanceService();