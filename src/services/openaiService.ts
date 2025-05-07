import OpenAI from 'openai';

class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text');
    }
  }

  async analyzeDocument(text: string): Promise<string> {
    try {
      const prompt = `
        Please analyze the following document and provide key insights:
        "${text}"
        
        Include:
        1. Document type and purpose
        2. Key dates and deadlines
        3. Important terms or conditions
        4. Any potential issues or areas needing attention
        5. Recommended actions
      `;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw new Error('Failed to analyze document');
    }
  }

  async answerDocumentQuestion(context: string, question: string): Promise<string> {
    try {
      const prompt = `
        Context: ${context}
        Question: ${question}
        Please provide a clear and concise answer based on the context above.
      `;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to answer question');
    }
  }
}

export default new OpenAIService();