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

  async diagnoseIssue(propertyId: string, messages: ChatMessage[]) {
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
              - Security breaches`
          },
          ...conversationHistory
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content || '';
      const isUrgent = response.startsWith('URGENT:');

      if (isUrgent) {
        await this.notifyEmergencyContacts(propertyId, response);
      }

      return {
        response: isUrgent ? response.substring(7).trim() : response,
        isUrgent
      };
    } catch (error) {
      console.error('Error diagnosing issue:', error);
      throw error;
    }
  }

  private async notifyEmergencyContacts(propertyId: string, issue: string) {
    try {
      // Get emergency contacts
      const { data: contacts } = await supabase
        .from('contacts')
        .select('phone')
        .eq('property_id', propertyId)
        .eq('category', 'emergency');

      if (!contacts?.length) return;

      // Send SMS to each contact
      await Promise.all(contacts.map(contact =>
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sms`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone: contact.phone,
              message: `URGENT MAINTENANCE ISSUE: ${issue.substring(0, 100)}...`
            })
          }
        )
      ));
    } catch (error) {
      console.error('Error notifying emergency contacts:', error);
    }
  }
}

export default new MaintenanceDiagnosisService();