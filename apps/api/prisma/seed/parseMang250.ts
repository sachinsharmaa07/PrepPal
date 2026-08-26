import * as fs from 'fs';
import * as path from 'path';

interface Problem {
  title: string;
  topic: string;
}

function parseMang250() {
  const txtPath = path.join(__dirname, '../../../../neetcode250.txt');
  const jsonPath = path.join(__dirname, 'mang250.json');

  if (!fs.existsSync(txtPath)) {
    console.error("Could not find neetcode250.txt at:", txtPath);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(txtPath, 'utf-8');
  const lines = fileContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const problems: Problem[] = [];
  let currentTopic = "";
  
  // Regex to match topic headers like "1. Arrays & Hashing — 0/22"
  const topicRegex = /^\d+\.\s+(.*?)\s+—/;

  for (const line of lines) {
    // Stop parsing if we reach the "Overall Progress" section at the end
    if (line === 'Overall Progress') {
      break;
    }

    // Match topic header
    const topicMatch = line.match(topicRegex);
    if (topicMatch) {
      currentTopic = topicMatch[1].trim();
      continue;
    }

    // Ignore lines that are just stats like "Solved: 8"
    if (line.startsWith('Solved:')) {
      continue;
    }

    // Clean up problem titles
    let title = line;
    // Strip emojis
    title = title.replace('✅ ', '').replace('⬜ ', '').replace('✅', '').replace('⬜', '').trim();
    
    // Ignore any lines that might accidentally be numbers or empty after stripping
    if (!title) continue;

    problems.push({
      title,
      topic: currentTopic
    });
  }

  fs.writeFileSync(jsonPath, JSON.stringify(problems, null, 2));
  console.log(`Successfully parsed ${problems.length} problems into mang250.json`);
}

parseMang250();
