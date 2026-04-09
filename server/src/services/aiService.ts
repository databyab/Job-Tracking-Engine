import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { ParsedJobData } from '../types';

class AIService {
  private openai: OpenAI | null = null;
  private groq: Groq | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    
    if (process.env.GROQ_API_KEY) {
      this.groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
    }
  }

  private systemPrompt = `You are a professional technical recruiter. Extract the following information from the job description and return it as a JSON object:
  - company: String
  - role: String
  - location: String
  - requiredSkills: Array of Strings
  - niceToHaveSkills: Array of Strings
  - seniority: String (Junior, Mid, Senior, Lead, Executive)
  
  Also, provide 3-5 high-impact resume bullet points tailored to this specific role that a candidate could use. Return them in an array named 'suggestions'.
  
  Return ONLY the JSON.`;

  async parseJobDescription(jd: string): Promise<{ parsedData: ParsedJobData; suggestions: string[] }> {
    // 1. Try OpenAI first
    if (this.openai) {
      try {
        return await this.parseWithOpenAI(jd);
      } catch (error: any) {
        // Fallback if credits out (402) or quota exceeded (429) or other API errors
        console.warn('OpenAI failed, attempting Groq fallback...', error.message);
        if (this.groq) {
          return await this.parseWithGroq(jd);
        }
        throw error;
      }
    }

    // 2. Try Groq if OpenAI is not configured
    if (this.groq) {
      return await this.parseWithGroq(jd);
    }

    throw new Error('No AI provider (OpenAI or Groq) is configured.');
  }

  private async parseWithOpenAI(jd: string) {
    if (!this.openai) throw new Error('OpenAI not initialized');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: jd },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Failed to get content from OpenAI');

    const result = JSON.parse(content);
    const { suggestions, ...parsedData } = result;

    return {
      parsedData: parsedData as ParsedJobData,
      suggestions: suggestions as string[],
    };
  }

  private async parseWithGroq(jd: string) {
    if (!this.groq) throw new Error('Groq not initialized');

    const response = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: jd },
      ],
      // Groq supports JSON mode via message instructions and model choice
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Failed to get content from Groq');

    const result = JSON.parse(content);
    const { suggestions, ...parsedData } = result;

    return {
      parsedData: parsedData as ParsedJobData,
      suggestions: suggestions as string[],
    };
  }
}

export default new AIService();
