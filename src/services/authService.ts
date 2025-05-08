import { User } from '@supabase/supabase-js';

// Demo user data
const DEMO_USERS = {
  tenant: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'tenant@test.com',
    user_metadata: { role: 'tenant' }
  },
  landlord: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'landlord@test.com',
    user_metadata: { role: 'landlord' }
  }
};

class AuthService {
  private currentUser: User | null = null;

  async signUp(email: string, password: string, options?: { data?: Record<string, any> }) {
    // Demo mode - return mock data
    if (email === 'tenant@test.com') {
      return { data: { user: DEMO_USERS.tenant } };
    }
    return { data: { user: DEMO_USERS.landlord } };
  }

  async signIn(email: string, password: string) {
    // Demo mode - return mock data
    if (email === 'tenant@test.com') {
      this.currentUser = DEMO_USERS.tenant as User;
      return { data: { user: DEMO_USERS.tenant } };
    }
    if (email === 'landlord@test.com') {
      this.currentUser = DEMO_USERS.landlord as User;
      return { data: { user: DEMO_USERS.landlord } };
    }
    throw new Error('Invalid credentials');
  }

  async signOut() {
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    // Demo mode - return mock subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }

  getSupabase() {
    return null; // Demo mode - no Supabase instance needed
  }
}

export default new AuthService();