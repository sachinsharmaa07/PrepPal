import * as fs from 'fs';
import * as path from 'path';
import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const groq = new Groq({ apiKey: GROQ_API_KEY });

const inputPath = path.join(__dirname, '../../../web/src/data/mang250.json');
const outputPath = path.join(__dirname, '../../../web/src/data/mang250_enriched.json');

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateProblemData(title: string, topic: string) {
  const prompt = `
You are an expert algorithm platform content generator (like LeetCode).
Generate the problem statement, constraints, and 3 test cases for the classic algorithm problem: "${title}" from the topic "${topic}".

Return ONLY a raw JSON object with this exact schema (no markdown formatting, no comments, just valid JSON):
{
  "title": "${title}",
  "topic": "${topic}",
  "descriptionMd": "The markdown formatted problem statement including examples and constraints.",
  "testCases": [
    { "input": "[2,7,11,15], 9", "expectedOutput": "[0,1]" },
    { "input": "[3,2,4], 6", "expectedOutput": "[1,2]" }
  ]
}
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });
    
    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to generate data for " + title + ":", error);
    return null;
  }
}

async function main() {
  const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  let enrichedData: any[] = [];

  if (fs.existsSync(outputPath)) {
    enrichedData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    console.log("Found existing " + enrichedData.length + " enriched problems. Resuming...");
  }

  const limit = 15;
  const problemsToProcess = rawData.slice(enrichedData.length, limit);

  if (problemsToProcess.length === 0) {
    console.log("Already enriched the target number of problems.");
    return;
  }

  console.log("Starting enrichment for " + problemsToProcess.length + " problems...");

  for (let i = 0; i < problemsToProcess.length; i++) {
    const p = problemsToProcess[i];
    console.log("Processing [" + (i + 1) + "/" + problemsToProcess.length + "]: " + p.title);
    
    const enriched = await generateProblemData(p.title, p.topic);
    if (enriched) {
      enrichedData.push(enriched);
      fs.writeFileSync(outputPath, JSON.stringify(enrichedData, null, 2));
    }
    
    await sleep(2000); 
  }

  console.log("\\nSuccess! Enriched " + enrichedData.length + " problems and saved to mang250_enriched.json");
}

main().catch(console.error);
