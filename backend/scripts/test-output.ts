import { generateSection } from '../src/services/groq';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const sections = ['architecture'];
  const projectName = 'FoodCart';
  const description = 'A B2C web-only food ordering platform';
  const answers = 'MVP, solo developer, web app';

  for (const section of sections) {
    try {
      console.log(`\n=== Generating ${section} ===`);
      const result = await generateSection(section, projectName, description, answers);
      console.log(JSON.stringify(result, null, 2));
    } catch (error: any) {
      console.error(`Error for ${section}:`, error.message);
    }
  }
}

run();
