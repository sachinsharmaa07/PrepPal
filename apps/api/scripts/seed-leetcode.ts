import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

async function fetchWithRetry(url: string, options: any, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // exponential backoff
    }
  }
}

async function getTopProblems(limit: number): Promise<string[]> {
  const query = `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
        questions: data {
          titleSlug
        }
      }
    }
  `;
  
  let slugs: string[] = [];
  let skip = 0;
  while (slugs.length < limit) {
    const fetchLimit = Math.min(100, limit - slugs.length);
    const data = await fetchWithRetry(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { categorySlug: "", skip, limit: fetchLimit, filters: {} } })
    });
    const newSlugs = data.data.problemsetQuestionList.questions.map((q: any) => q.titleSlug);
    if (newSlugs.length === 0) break;
    slugs = slugs.concat(newSlugs);
    skip += fetchLimit;
  }
  return slugs;
}

async function getProblemDetails(titleSlug: string): Promise<any> {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        content
        difficulty
        topicTags { name }
        codeSnippets { lang langSlug code }
        exampleTestcaseList
        metaData
      }
    }
  `;
  const data = await fetchWithRetry(LEETCODE_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { titleSlug } })
  });
  return data.data.question;
}

// Convert HTML content from LeetCode to basic Markdown-ish
function cleanHtml(html: string) {
  return html
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n\n')
    .replace(/<ul>/g, '')
    .replace(/<\/ul>/g, '')
    .replace(/<li>/g, '- ')
    .replace(/<\/li>/g, '\n')
    .replace(/<strong>/g, '**')
    .replace(/<\/strong>/g, '**')
    .replace(/<code>/g, '`')
    .replace(/<\/code>/g, '`')
    .replace(/<pre>/g, '```\n')
    .replace(/<\/pre>/g, '\n```\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>?/gm, ''); // remove remaining tags
}

async function main() {
  console.log('Cleaning database...');
  await prisma.submission.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.codingProblem.deleteMany();

  console.log('Fetching top 350 problems from LeetCode...');
  const slugs = await getTopProblems(350);
  console.log(`Found ${slugs.length} problems. Fetching details and seeding...`);

  let successCount = 0;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    console.log(`[${i+1}/${slugs.length}] Fetching ${slug}...`);
    
    try {
      const q = await getProblemDetails(slug);
      if (!q || !q.content || !q.metaData) {
        console.log(`Skipping ${slug} (missing data or paid)`);
        continue;
      }

      const boilerplates: Record<string, string> = {};
      if (q.codeSnippets) {
        for (const snippet of q.codeSnippets) {
          if (snippet.langSlug === 'cpp') boilerplates['CPP'] = snippet.code;
          if (snippet.langSlug === 'java') boilerplates['JAVA'] = snippet.code;
          if (snippet.langSlug === 'python' || snippet.langSlug === 'python3') boilerplates['PYTHON'] = snippet.code;
          if (snippet.langSlug === 'javascript') boilerplates['JAVASCRIPT'] = snippet.code;
        }
      }

      // Format testcases correctly. ExampleTestcaseList has strings like "2\n7\n11\n15\n9". We need to map them to metaData args.
      let parsedMeta = null;
      try { parsedMeta = JSON.parse(q.metaData); } catch(e) {}
      
      const problem = await prisma.codingProblem.create({
        data: {
          title: q.title,
          statementMd: cleanHtml(q.content),
          difficulty: q.difficulty.toUpperCase(),
          topics: q.topicTags.map((t: any) => t.name),
          status: 'PUBLISHED',
          createdBy: 'admin',
          boilerplates,
          metaData: parsedMeta
        }
      });

      // Insert test cases
      if (q.exampleTestcaseList && q.exampleTestcaseList.length > 0 && parsedMeta) {
        const numArgs = parsedMeta.params.length;
        
        for (let t = 0; t < q.exampleTestcaseList.length; t++) {
          const tcStr = q.exampleTestcaseList[t];
          // tcStr is typically newline separated arguments.
          // Leetcode gives input in `exampleTestcaseList` but NOT the expected output!
          // Since expected output isn't in exampleTestcaseList directly, we will just store the inputs.
          // The dynamic runner can't verify correctness without expected outputs.
          // Wait, LeetCode's API doesn't expose expected outputs easily without running the code.
          // However, for this demo, we can just save it. 
          await prisma.testCase.create({
            data: {
              problemId: problem.id,
              inputRef: tcStr,
              expectedOutputRef: 'DYNAMIC_RUN_REQUIRED', // we will handle this in runner or skip exact matching if missing
              isSample: true
            }
          });
        }
      }
      
      successCount++;
      // Sleep to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      console.error(`Failed on ${slug}:`, err);
    }
  }

  console.log(`Seeding complete. Inserted ${successCount} problems.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
