import { Injectable } from '@angular/core';
import OpenAI from 'openai';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'], // Use environment variables in production
      dangerouslyAllowBrowser: true, // Required for browser usage
    });
  }

  async interpretDescription(description: string): Promise<string> {
    const prompt = ``;
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 10,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  }
}
