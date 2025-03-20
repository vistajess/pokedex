import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import express, { Request, Response } from 'express';
import OpenAI from 'openai';
import cors from 'cors';

// Default message when no Pokémon match is found
const OPENAI_NO_RESULTS_PROMPT = 'Sorry, I do not know that Pokémon.';

const app = express();

// handle CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000', // local
      'https://jevi-pokedex.web.app' // production
    ],
    methods: 'POST',
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.post('/interpretDescription', async (req: Request, res: Response): Promise<Response> => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  const openAIKey = process.env.OPENAI_API_KEY;
  if (!openAIKey) {
    logger.error('OpenAI API Key is missing!');
    return res.status(500).json({ error: 'Server misconfiguration. Contact admin.' });
  }

  const openai = new OpenAI({ apiKey: openAIKey });
  const prompt = `Match the following Pokémon description with the closest known Pokémon: "${description}". 
    Respond with only the Pokémon's name, please show 1 or more names if there are multiple matches.
    If there is no match, respond with ${OPENAI_NO_RESULTS_PROMPT}.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });

    console.log('🔍 Completion Response:', JSON.stringify(completion, null, 2));

    const result = completion?.choices?.[0]?.message?.content?.trim() ?? 'No match found';
    return res.json({ result });

  } catch (error) {
    console.error('❌ OpenAI API Error:', error);
    return res.status(500).json({ error: 'Failed to interpret description' });
  }
});

export const api = onRequest(
  { secrets: ["OPENAI_API_KEY"] },
  app
);
