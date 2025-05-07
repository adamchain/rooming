import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

class DocumentAnalysisService {
  private openai: OpenAI;
  private supabase;

  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );

    // Set the worker source path to the CDN version to avoid local file issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }

  async extractText(file: File): Promise<string> {
    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      switch (extension) {
        case 'pdf':
          return await this.extractFromPdf(file);
        case 'txt':
          return await this.extractFromTxt(file);
        case 'doc':
        case 'docx':
          return await this.extractFromWord(file);
        default:
          throw new Error(`Unsupported file format: ${extension}`);
      }
    } catch (error) {
      console.error('Error extracting text from document:', error);
      throw new Error('Failed to extract text from the document');
    }
  }

  private async extractFromPdf(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }

      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private async extractFromTxt(file: File): Promise<string> {
    try {
      return await file.text();
    } catch (error) {
      console.error('Error extracting text from TXT:', error);
      throw new Error('Failed to extract text from TXT file');
    }
  }

  private async extractFromWord(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('Error extracting text from Word document:', error);
      throw new Error('Failed to extract text from Word document');
    }
  }

  async analyzeDocument(text: string): Promise<string> {
    try {
      const prompt = `
        Please analyze the following document and provide key insights:
        "${this.truncateText(text, 6000)}"
        
        Include:
        1. Document type and purpose
        2. Key dates and deadlines
        3. Important terms or conditions
        4. Any potential issues or areas needing attention
        5. Recommended actions
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw new Error('Failed to analyze document');
    }
  }

  async answerQuestion(documentText: string, question: string): Promise<string> {
    try {
      const prompt = `
        Based on the following document content:
        "${this.truncateText(documentText, 6000)}"
        
        Please answer this question:
        "${question}"
        
        Provide a clear and concise answer based on the document content.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to answer question');
    }
  }

  private truncateText(text: string, maxLength: number = 6000): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '... [Text truncated for API length limitations]';
  }
}

export default new DocumentAnalysisService();