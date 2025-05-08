import { createClient } from '@supabase/supabase-js';
import authService from './authService';

// Demo data
const DEMO_PROPERTIES = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Sunset Apartments',
    address: '123 Main Street, Apt 4B',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Ocean View Condos',
    address: '456 Beach Road, Unit 7',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Mountain Lodge',
    address: '789 Pine Street',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

class PropertyService {
  private supabase;

  constructor() {
    this.supabase = authService.getSupabase();
  }

  async getProperties() {
    // Demo mode - return mock data
    return DEMO_PROPERTIES;
  }

  async addProperty(property: {
    name?: string;
    address: string;
  }) {
    const newProperty = {
      id: crypto.randomUUID(),
      ...property,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    DEMO_PROPERTIES.push(newProperty);
    return newProperty;
  }

  async updateProperty(id: string, property: {
    name?: string;
    address?: string;
  }) {
    const index = DEMO_PROPERTIES.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Property not found');
    
    DEMO_PROPERTIES[index] = {
      ...DEMO_PROPERTIES[index],
      ...property,
      updated_at: new Date().toISOString()
    };
    return DEMO_PROPERTIES[index];
  }

  async deleteProperty(id: string) {
    const index = DEMO_PROPERTIES.findIndex(p => p.id === id);
    if (index !== -1) {
      DEMO_PROPERTIES.splice(index, 1);
    }
  }
}

export default new PropertyService();