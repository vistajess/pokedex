import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { environment } from 'src/environments/environment';

// Default message when no Pokémon match is found
export const OPENAI_NO_RESULTS_PROMPT = 'Sorry, I do not know that Pokémon.';

@Injectable({
  providedIn: 'root', 
})
export class OpenAIService {
  private openai: OpenAI; // Instance of the OpenAI client

  constructor() {
    // Initialize OpenAI client with API key from environment variables
    this.openai = new OpenAI({
      apiKey: environment.OPENAI_API_KEY, // Use environment variables in production
      dangerouslyAllowBrowser: true, // Required for browser usage
    });
  }

  // Method to interpret a Pokémon description and return the closest match
  interpretDescription(description: string): Promise<string> {
    // Construct the prompt for the OpenAI API
    const prompt = `Match the following Pokémon description with the closest known Pokémon: "${description}". 
    Respond with only the Pokémon's name, please show 1 or more names if there are multiple matches.
    If there is no match, respond with ${OPENAI_NO_RESULTS_PROMPT}.`;

    // Call the OpenAI API to get the completion
    return this.openai.chat.completions.create({
      model: 'gpt-4o-mini', // Specify the model to use
      messages: [{ role: 'user', content: prompt }], // User message containing the prompt
      max_tokens: 50, // Limit the response length
    })
    .then(completion => 
      // Return the trimmed content of the first choice or a default message if no match found
      completion?.choices?.[0]?.message?.content?.trim() ?? 'No match found'
    )
    .catch(error => {
      // Log any errors and throw a new error with the message
      console.error('OpenAI API Error:', error);
      throw new Error(error.message);
    });
  }
}
