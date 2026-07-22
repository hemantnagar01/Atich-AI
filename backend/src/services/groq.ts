import OpenAI from 'openai';
import { sectionSchemas } from '../schemas';

let groqInstance: OpenAI | null = null;

function getGroqClient() {
  if (!groqInstance) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("CRITICAL: GROQ_API_KEY environment variable is missing.");
    }
    groqInstance = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return groqInstance;
}

const MODEL = 'openai/gpt-oss-120b';

const SYSTEM_PROMPT = `You are Atich, an expert Technical Architect AI. Your job is to generate a comprehensive, production-ready technical architecture blueprint based on a user's project description and constraints.

You MUST output your response ENTIRELY as a valid JSON object matching the exact JSON schema provided via strict structured outputs. Do not include markdown formatting (like \`\`\`json) outside the JSON object.

CRITICAL INSTRUCTIONS:
1. MERMAID SYNTAX:
   - For architecture (\`graph TD\`): Node IDs MUST be simple alphanumeric words without spaces or punctuation (e.g., \`UI\`, \`API\`, \`DB\`). You MUST wrap the text inside node labels with double quotes if they contain spaces or parentheses, for example: \`UI["Web UI (React)"]\`. NEVER use spaces in the Node ID itself!
   - For database (\`erDiagram\`): DO NOT use brackets \`[]\` for entity names. Use standard alphanumeric names for entities and wrap relationship labels in quotes, e.g., \`USER ||--o{ POST : "creates"\`.
   - General: Escape all quotation marks properly inside the JSON string. Do not wrap the Mermaid code in markdown blocks (\`\`\`mermaid).
2. CALIBRATION: Carefully review the user's scale (e.g., MVP vs Production) and team size (e.g., Solo vs Team). 
   - If "MVP" or "Solo", recommend managed services (Firebase, Supabase, Vercel, Render) and simpler stacks (monoliths).
   - If "Production" or "Team", recommend scalable, enterprise-grade tools (AWS ECS/EKS, Kubernetes, Microservices, Kafka).
   - Cost estimates in AWS notes should reflect this scale.
3. QUALITY: Do not provide toy examples. The architecture should be genuinely production-ready, highlighting real-world challenges like auth, caching, and rate-limiting where appropriate.`;

export async function generateClarifyingQuestions(projectName: string, description: string): Promise<string[]> {
  const completion = await getGroqClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Project Name: ${projectName}\nDescription: ${description}\n\nAsk 3-5 clarifying questions to help design the architecture (e.g. web/mobile, B2B/B2C, scale, team).` }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'questions_schema',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: { type: 'string', description: 'The question to ask the user' },
                  options: {
                    type: 'array',
                    items: { type: 'string' },
                    description: '3 to 4 short, distinct choices for this question'
                  }
                },
                required: ['text', 'options'],
                additionalProperties: false
              }
            }
          },
          required: ['questions'],
          additionalProperties: false
        }
      }
    }
  });

  const content = completion.choices[0]?.message?.content || '{"questions": []}';
  const data = JSON.parse(content);
  return data.questions;
}

export async function generateSection(sectionName: string, projectName: string, description: string, answers: string) {
  const schema = sectionSchemas[sectionName];
  if (!schema) throw new Error(`Schema not found for section: ${sectionName}`);

  const completion = await getGroqClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\nYou are generating the [${sectionName}] section of the blueprint.` },
      { role: 'user', content: `Project Name: ${projectName}\nDescription: ${description}\nUser Clarifications: ${answers}` }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: `${sectionName}_schema`,
        strict: true,
        schema
      }
    }
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return JSON.parse(content);
}

export async function refineSection(sectionName: string, existingData: any, instruction: string) {
  const schema = sectionSchemas[sectionName];
  if (!schema) throw new Error(`Schema not found for section: ${sectionName}`);

  const completion = await getGroqClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\nYou are refining the [${sectionName}] section of the blueprint.` },
      { role: 'user', content: `Current Data: ${JSON.stringify(existingData)}\n\nInstruction to refine: ${instruction}` }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: `${sectionName}_schema`,
        strict: true,
        schema
      }
    }
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return JSON.parse(content);
}

export async function chatWithBlueprint(chatHistory: any[], blueprintData: any) {
  const completion = await getGroqClient().chat.completions.create({
    model: MODEL,
    messages: [
      { 
        role: 'system', 
        content: `${SYSTEM_PROMPT}

You are now in "Chat" mode. The user has already generated a blueprint, and you must answer their questions about it or modify it based on their instructions.

Valid sections you can modify: ${Object.keys(sectionSchemas).join(', ')}

Analyze the user's message.
- If they are just asking a question, provide a helpful 'reply' and an empty 'updates' array.
- If they are requesting a change to the architecture, tech stack, features, etc., provide a helpful 'reply' AND fill the 'updates' array with the specific sections that need to change and explicit instructions on HOW to change them.
` 
      },
      { 
        role: 'user', 
        content: `Current Blueprint Data:\n${JSON.stringify(blueprintData)}\n\nChat History:\n${JSON.stringify(chatHistory)}` 
      }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: `chat_response_schema`,
        strict: true,
        schema: {
          type: "object",
          properties: {
            reply: { type: "string", description: "Your response to the user's message" },
            updates: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section: { type: "string", description: "The name of the section to update" },
                  instruction: { type: "string", description: "Explicit instruction on how to update this section" }
                },
                required: ["section", "instruction"],
                additionalProperties: false
              },
              description: "List of sections to update. Leave empty if no changes are requested."
            }
          },
          required: ["reply", "updates"],
          additionalProperties: false
        }
      }
    }
  });

  const content = completion.choices[0]?.message?.content || '{"reply": "I encountered an error.", "updates": []}';
  return JSON.parse(content);
}
