import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database from Enriched JSON...');

  // Wipe database
  await prisma.submission.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.codingProblem.deleteMany();
  console.log('Database wiped.');

  const dataPath = path.join(__dirname, '../../web/src/data/mang250_enriched.json');
  if (!fs.existsSync(dataPath)) {
    console.error('Enriched JSON not found at:', dataPath);
    return;
  }

  const enrichedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  for (const item of enrichedData) {
    if (!item || !item.title) continue;

    console.log(`Seeding problem: ${item.title}`);

    // Some LLMs might return boilerplates with escaped newlines or literals. Handle nicely.
    const getBoilerplate = (code: string) => code ? code.replace(/\\\\n/g, '\\n') : '';

    const problem = await prisma.codingProblem.create({
      data: {
        title: item.title,
        statementMd: item.descriptionMd || 'No description provided.',
        difficulty: 'MEDIUM', // default
        topics: [item.topic || 'General'],
        createdBy: 'admin',
        
        // Exact matching boilerplates
        boilerplates: {
          CPP: getBoilerplate(item.boilerplates?.CPP),
          JAVA: getBoilerplate(item.boilerplates?.JAVA),
          PYTHON: getBoilerplate(item.boilerplates?.PYTHON),
          JAVASCRIPT: getBoilerplate(item.boilerplates?.JAVASCRIPT),
        }
      }
    });

    const testCases = item.testCases || [];
    for (const tc of testCases) {
      await prisma.testCase.create({
        data: {
          problemId: problem.id,
          inputRef: tc.input || '',
          expectedOutputRef: tc.expectedOutput || '',
          isSample: tc.isSample === true
        }
      });
    }
  }

  console.log(`Successfully seeded ${enrichedData.length} enriched problems.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
