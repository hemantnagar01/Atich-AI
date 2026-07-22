import { Router, Request, Response } from 'express';
import { generateClarifyingQuestions, generateSection, refineSection } from '../services/groq';
import { sectionSchemas } from '../schemas';

export const blueprintRouter = Router();

blueprintRouter.post('/clarify', async (req: Request, res: Response) => {
  try {
    const { projectName, description } = req.body;
    if (!projectName || !description) {
      return res.status(400).json({ error: "projectName and description are required" });
    }
    const questions = await generateClarifyingQuestions(projectName, description);
    res.json({ questions });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

blueprintRouter.post('/stream', async (req: Request, res: Response) => {
  const { projectName, description, answers, sectionsToGenerate } = req.body;
  
  if (!projectName || !description) {
    return res.status(400).json({ error: "projectName and description are required" });
  }

  // Convert the structured answers object into a prose string for the LLM
  let answersProse = "";
  if (answers && typeof answers === 'object') {
    answersProse = Object.entries(answers)
      .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
      .join('\n\n');
  } else if (typeof answers === 'string') {
    answersProse = answers;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  res.write(`event: connected\ndata: ${JSON.stringify({ message: "Stream initialized" })}\n\n`);

  // Default to all sections, but allow passing a subset (e.g. for retrying specific failed sections)
  const allSections = Object.keys(sectionSchemas);
  const sections = Array.isArray(sectionsToGenerate) && sectionsToGenerate.length > 0 
    ? sectionsToGenerate.filter(s => allSections.includes(s))
    : allSections;
  
  // Sequential execution of requested sections to avoid rate limits
  for (const sectionName of sections) {
    try {
      const data = await generateSection(sectionName, projectName, description, answersProse);
      res.write(`event: section\ndata: ${JSON.stringify({ section: sectionName, data })}\n\n`);
    } catch (error: any) {
      console.error(`Error generating ${sectionName}:`, error);
      res.write(`event: error\ndata: ${JSON.stringify({ section: sectionName, error: error.message })}\n\n`);
    }
  }
  
  res.write(`event: done\ndata: ${JSON.stringify({ message: "Blueprint generation complete" })}\n\n`);
  res.end();
});

blueprintRouter.post('/refine', async (req: Request, res: Response) => {
  try {
    const { sectionsToRefine, blueprintData, instruction } = req.body;
    
    if (!Array.isArray(sectionsToRefine) || !blueprintData || !instruction) {
      return res.status(400).json({ error: "sectionsToRefine, blueprintData, and instruction are required" });
    }

    const updatedSections: Record<string, any> = {};
    
    for (const sectionName of sectionsToRefine) {
      if (sectionSchemas[sectionName]) {
        const currentData = blueprintData[sectionName];
        try {
          const newData = await refineSection(sectionName, currentData, instruction);
          updatedSections[sectionName] = newData;
        } catch (err: any) {
          console.error(`Error refining ${sectionName}:`, err);
        }
      }
    }
    
    res.json({ updatedSections });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

blueprintRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { chatHistory, blueprintData } = req.body;
    
    if (!Array.isArray(chatHistory) || !blueprintData) {
      return res.status(400).json({ error: "chatHistory and blueprintData are required" });
    }

    const { chatWithBlueprint } = await import('../services/groq');
    const response = await chatWithBlueprint(chatHistory, blueprintData);
    
    res.json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
