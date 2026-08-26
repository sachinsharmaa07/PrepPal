import { PrismaClient, ProblemDifficulty, ProblemStatus, Role } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting DB Seeding...");

  // 1. Ensure an admin user exists to be the creator
  const adminEmail = 'admin@preppal.dev';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'PrepPal Admin',
        passwordHash: 'dummy_hash', // In a real app, hash this properly
        role: Role.ADMIN,
        isVerified: true
      }
    });
    console.log("Created Admin User:", admin.id);
  } else {
    console.log("Admin User found:", admin.id);
  }

  // 2. Read parsed JSON
  const jsonPath = path.join(__dirname, 'seed/mang250.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Could not find mang250.json at ${jsonPath}. Please run the parser first.`);
  }

  const problemsData: { title: string; topic: string }[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Loaded ${problemsData.length} problems from mang250.json`);

  // Clear existing problems (optional, but good for idempotency)
  await prisma.codingProblem.deleteMany({});
  console.log("Cleared existing CodingProblems");

  // 3. Batch insert in chunks of 10
  const BATCH_SIZE = 10;
  
  // Create a function to determine difficulty (mock logic for variety)
  const getDifficulty = (index: number): ProblemDifficulty => {
    if (index % 5 === 0) return ProblemDifficulty.HARD;
    if (index % 2 === 0) return ProblemDifficulty.EASY;
    return ProblemDifficulty.MEDIUM;
  };

  for (let i = 0; i < problemsData.length; i += BATCH_SIZE) {
    const batch = problemsData.slice(i, i + BATCH_SIZE);
    
    const dbPayload = batch.map((p, idx) => ({
      title: p.title,
      statementMd: `# ${p.title}\n\nGiven the problem statement for **${p.title}** (from topic ${p.topic}), implement an optimal solution.\n\n*Note: This is a seeded MANG250 problem.*\n`,
      difficulty: getDifficulty(i + idx),
      topics: [p.topic],
      status: ProblemStatus.PUBLISHED,
      createdBy: admin!.id
    }));

    await prisma.codingProblem.createMany({
      data: dbPayload
    });

    console.log(`Inserted batch ${(i / BATCH_SIZE) + 1} of ${Math.ceil(problemsData.length / BATCH_SIZE)} (${dbPayload.length} problems)`);
  }

  console.log(`\nSuccess! Inserted ${problemsData.length} MANG 250 problems.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
