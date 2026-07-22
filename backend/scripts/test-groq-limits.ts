import OpenAI from 'openai';
import { sectionSchemas } from '../src/schemas';
import dotenv from 'dotenv';

dotenv.config();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const MODEL = 'openai/gpt-oss-120b';

async function testParallelLimits() {
  if (!process.env.GROQ_API_KEY) {
    console.error("ERROR: GROQ_API_KEY is not set in the environment or .env file.");
    process.exit(1);
  }

  const sections = Object.keys(sectionSchemas);
  console.log(`Starting ${sections.length} parallel requests to Groq using ${MODEL}...`);

  const startTime = Date.now();

  const promises = sections.map(async (sectionName) => {
    try {
      const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: `You are a strict JSON generator. Generate the ${sectionName} section.` },
          { role: 'user', content: 'Generate some dummy data.' }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: `${sectionName}_schema`,
            strict: true,
            schema: sectionSchemas[sectionName]
          }
        }
      }).withResponse();

      const limit = response.response.headers.get('x-ratelimit-limit-tokens') || 'unknown';
      const remaining = response.response.headers.get('x-ratelimit-remaining-tokens') || 'unknown';
      const reset = response.response.headers.get('x-ratelimit-reset-tokens') || 'unknown';

      console.log(`[${sectionName}] SUCCESS`);
      console.log(`  Tokens Limit: ${limit}, Remaining: ${remaining}, Reset: ${reset}`);
      return { section: sectionName, status: 'success', remaining };
    } catch (error: any) {
      console.error(`[${sectionName}] ERROR: ${error.message}`);
      return { section: sectionName, status: 'error', error: error.message };
    }
  });

  const results = await Promise.allSettled(promises);
  
  const endTime = Date.now();
  console.log(`\nFinished in ${(endTime - startTime) / 1000} seconds.`);
  
  const successes = results.filter(r => r.status === 'fulfilled' && r.value.status === 'success').length;
  console.log(`Successful calls: ${successes}/${sections.length}`);
}

testParallelLimits();
