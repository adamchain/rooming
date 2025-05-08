import { createClient } from '@supabase/supabase-js';

// Demo data
const DEMO_TENANTS = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    property_id: '33333333-3333-3333-3333-333333333333',
    name: 'John Smith',
    email: 'tenant@test.com',
    phone: '555-0123',
    lease_start: '2024-01-01',
    lease_end: '2024-12-31',
    rent_amount: 1500,
    security_deposit: 2000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    property: {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Sunset Apartments',
      address: '123 Main Street, Apt 4B'
    }
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    property_id: '44444444-4444-4444-4444-444444444444',
    name: 'Sarah Johnson',
    email: 'sarah@test.com',
    phone: '555-0124',
    lease_start: '2024-02-01',
    lease_end: '2025-01-31',
    rent_amount: 1800,
    security_deposit: 2500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    property: {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Ocean View Condos',
      address: '456 Beach Road, Unit 7'
    }
  }
];

class TenantService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async getTenants() {
    // Demo mode - return mock data
    return DEMO_TENANTS;
  }

  async addTenant(tenant: any) {
    const newTenant = {
      id: crypto.randomUUID(),
      ...tenant,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property: {
        id: tenant.property_id,
        name: 'New Property',
        address: 'New Address'
      }
    };
    DEMO_TENANTS.push(newTenant);
    return newTenant;
  }

  async updateTenant(id: string, tenant: any) {
    const index = DEMO_TENANTS.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tenant not found');
    
    DEMO_TENANTS[index] = {
      ...DEMO_TENANTS[index],
      ...tenant,
      updated_at: new Date().toISOString()
    };
    return DEMO_TENANTS[index];
  }

  async deleteTenant(id: string) {
    const index = DEMO_TENANTS.findIndex(t => t.id === id);
    if (index !== -1) {
      DEMO_TENANTS.splice(index, 1);
    }
  }
}

export default new TenantService();