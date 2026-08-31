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
You are an expert algorithm platform content generator.
Generate the problem statement, boilerplates, and 10 test cases for the classic algorithm problem: "${title}" from the topic "${topic}".

Rules:
1. Provide 10 test cases (4 where isSample is true, 6 where isSample is false). The input must be a single string containing the arguments separated by a newline, or if it's an array, stringified. Example input: "[2,7,11,15]\\n9". Example expectedOutput: "[0,1]".
2. Provide precise boilerplate code for JAVASCRIPT, PYTHON, CPP, and JAVA.
3. CRITICAL: The function name, parameters, and return types MUST match the exact signature required to solve the specific problem. DO NOT copy example names like 'twoSum' or 'nums, target' unless the problem is actually Two Sum!
4. For C++ and Java, you MUST include a comment "// Implement optimal solution" inside the function.
5. The C++ boilerplate should include necessary includes like <vector>, <string>, etc., and return a default value that compiles (e.g., return {}; or return false;).
6. The Java boilerplate must be wrapped in class Solution { ... }.

Return ONLY a raw JSON object with this exact schema:
{
  "title": "${title}",
  "topic": "${topic}",
  "descriptionMd": "The markdown formatted problem statement including examples and constraints.",
  "boilerplates": {
    "JAVASCRIPT": "function ACTUAL_FUNCTION_NAME(ACTUAL_ARGS) {\\n  // Implement optimal solution\\n}",
    "PYTHON": "def ACTUAL_FUNCTION_NAME(ACTUAL_ARGS):\\n    # Implement optimal solution\\n    pass",
    "CPP": "#include <vector>\\nusing namespace std;\\n\\nACTUAL_RETURN_TYPE ACTUAL_FUNCTION_NAME(ACTUAL_ARGS) {\\n    // Implement optimal solution\\n    return DEFAULT_VALUE;\\n}",
    "JAVA": "class Solution {\\n    public ACTUAL_RETURN_TYPE ACTUAL_FUNCTION_NAME(ACTUAL_ARGS) {\\n        // Implement optimal solution\\n        return DEFAULT_VALUE;\\n    }\\n}"
  },
  "testCases": [
    { "input": "[2,7,11,15]\\n9", "expectedOutput": "[0,1]", "isSample": true },
    { "input": "[3,2,4]\\n6", "expectedOutput": "[1,2]", "isSample": false }
  ]
}
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b',
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 4096,
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

  const TARGET_PROBLEMS = 250;
  const problemsToProcess = rawData.slice(enrichedData.length, TARGET_PROBLEMS);

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
