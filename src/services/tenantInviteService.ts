import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { addDays } from 'date-fns';
import authService from './authService';

interface TenantInvite {
  id: string;
  property_id: string;
  name: string;
  email: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_at: string;
  updated_at: string;
  property?: {
    id: string;
    name: string | null;
    address: string;
  };
}

class TenantInviteService {
  private supabase;

  constructor() {
    this.supabase = authService.getSupabase();
  }

  async createInvite(data: {
    property_id: string;
    name: string;
    email: string;
  }): Promise<TenantInvite> {
    const token = nanoid(10);
    const expires_at = addDays(new Date(), 7).toISOString();

    try {
      // Create the invite record
      const { data: invite, error: dbError } = await this.supabase
        .from('tenant_invites')
        .insert([{
          ...data,
          token,
          status: 'pending',
          expires_at
        }])
        .select(`
          *,
          property:properties(id, name, address)
        `)
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to create invite record');
      }

      // Send invite email using Supabase Auth
      const { error: emailError } = await this.supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          data: {
            invite_token: token,
            property_id: data.property_id,
            name: data.name
          }
        }
      });

      if (emailError) {
        // If email fails, delete the invite record
        await this.supabase
          .from('tenant_invites')
          .delete()
          .eq('id', invite.id);
        
        throw emailError;
      }

      return invite;
    } catch (error) {
      console.error('Error in createInvite:', error);
      throw error instanceof Error ? error : new Error('Failed to create invite');
    }
  }

  async getInviteByToken(token: string): Promise<TenantInvite | null> {
    try {
      const { data, error } = await this.supabase
        .from('tenant_invites')
        .select(`
          *,
          property:properties(id, name, address)
        `)
        .eq('token', token)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invite:', error);
      return null;
    }
  }

  async acceptInvite(token: string, userData: {
    email: string;
    password: string;
  }): Promise<void> {
    try {
      const invite = await this.getInviteByToken(token);
      if (!invite) throw new Error('Invalid or expired invite');

      // Create user account
      const { error: signUpError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            invite_token: token,
            property_id: invite.property_id,
            name: invite.name
          }
        }
      });

      if (signUpError) throw signUpError;

      // Update invite status
      const { error: updateError } = await this.supabase
        .from('tenant_invites')
        .update({ status: 'accepted' })
        .eq('token', token);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error accepting invite:', error);
      throw new Error('Failed to accept invite');
    }
  }

  async getInvites(): Promise<TenantInvite[]> {
    try {
      const { data, error } = await this.supabase
        .from('tenant_invites')
        .select(`
          *,
          property:properties(id, name, address)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invites:', error);
      throw new Error('Failed to fetch invites');
    }
  }

  async deleteInvite(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('tenant_invites')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting invite:', error);
      throw new Error('Failed to delete invite');
    }
  }
}

export default new TenantInviteService();