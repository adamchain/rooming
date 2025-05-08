import { supabase } from '../lib/supabase';
import OpenAI from 'openai';

interface MaintenanceRequest {
  id?: string;
  property_id: string;
  title?: string;
  description: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: string[];
}

class MaintenanceDiagnosisService {
  private openai;

  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  async diagnoseIssue(propertyId: string, messages: ChatMessage[], category?: string) {
    try {
      // Prepare conversation history for AI
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.attachments 
          ? `${msg.content}\n[Attachments: ${msg.attachments.length} files]` 
          : msg.content
      }));

      // Get AI diagnosis
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a property maintenance expert. Analyze maintenance issues and:
              1. Determine severity (low, medium, high, urgent)
              2. Identify if immediate action is needed
              3. Suggest solutions
              4. Provide safety warnings when applicable
              
              If you detect any of these URGENT situations, respond with "URGENT:" at the start:
              - Gas leaks
              - Electrical hazards
              - Flooding
              - Fire hazards
              - Structural damage
              - No heat in winter
              - No AC in extreme heat
              - Security breaches
              - Pest infestations that pose health risks
              - Major appliance failures affecting habitability
              
              Category: ${category || 'Not specified'}`
          },
          ...conversationHistory
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content || '';
      const isUrgent = response.startsWith('URGENT:');

      if (isUrgent) {
        await this.notifyPropertyManagement(propertyId, response);
      }

      return {
        response: isUrgent 
          ? `${response.substring(7).trim()}\n\n✓ Property management has been notified and will contact you shortly with next steps.` 
          : response,
        isUrgent
      };
    } catch (error) {
      console.error('Error diagnosing issue:', error);
      throw error;
    }
  }

  private async notifyPropertyManagement(propertyId: string, issue: string) {
    try {
      // Get property details including owner
      const { data: property } = await supabase
        .from('properties')
        .select(`
          id,
          name,
          address,
          user_id
        `)
        .eq('id', propertyId)
        .single();

      if (!property) return;

      // Create maintenance request record
      const { data: request } = await supabase
        .from('maintenance_requests')
        .insert({
          property_id: propertyId,
          title: 'Urgent Maintenance Issue',
          description: issue.substring(7).trim(), // Remove "URGENT:" prefix
          priority: 'urgent',
          status: 'pending'
        })
        .select()
        .single();

      if (!request) return;

      // Create maintenance diagnosis record
      await supabase
        .from('maintenance_diagnoses')
        .insert({
          request_id: request.id,
          diagnosis: issue.substring(7).trim(),
          severity: 'critical',
          recommended_action: 'Immediate attention required'
        });

      // Get emergency contacts for notifications
      const { data: contacts } = await supabase
        .from('contacts')
        .select('phone, email')
        .eq('user_id', property.user_id)
        .eq('category_id', (
          await supabase
            .from('contact_categories')
            .select('id')
            .eq('name', 'Contractor')
            .single()
        ).data?.id);

      // Send notifications (would integrate with your notification system)
      if (contacts?.length) {
        // Example: Send SMS via Twilio edge function
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sms`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phones: contacts.map(c => c.phone).filter(Boolean),
              message: `URGENT MAINTENANCE ISSUE at ${property.name || property.address}: ${issue.substring(7, 100)}...`
            })
          }
        );
      }
    } catch (error) {
      console.error('Error notifying property management:', error);
      // Don't throw - we don't want to break the chat flow if notifications fail
    }
  }
}

export default new MaintenanceDiagnosisService();