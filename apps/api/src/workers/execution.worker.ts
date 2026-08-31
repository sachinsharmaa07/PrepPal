import { Worker, Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { connection } from '../queues/execution.queue';
import { JudgeService } from '../modules/coding/judge.service';
import { getIO } from '../socket';

const prisma = new PrismaClient();

export const executionWorker = new Worker('executionQueue', async (job: Job) => {
  const { submissionId, mode, userId, problemId, language, code } = job.data;

  try {
    if (mode === 'submit') {
      await handleSubmission(submissionId);
    } else if (mode === 'run') {
      await handleRun(job.id!, userId, problemId, language, code);
    }
  } catch (err: any) {
    console.error('Worker execution failed', err);
    throw err;
  }
}, { connection });

async function handleSubmission(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { problem: true }
  });
  if (!submission) return;

  const testCases = await prisma.testCase.findMany({
    where: { problemId: submission.problemId },
    orderBy: { order: 'asc' }
  });

  const timeLimit = submission.problem.timeLimitMs || 2000;
  const memoryLimit = submission.problem.memoryLimitMb || 256;
  const langId = JudgeService.getLanguageId(submission.language);

  let passedTests = 0;
  let allPassed = true;
  let failedTestCaseId = null;

  for (const tc of testCases) {
    const result = await JudgeService.submitToJudge0(submission.code, langId, tc.inputRef, timeLimit, memoryLimit);
    
    // Normalize Judge0 Response
    let actualOutput = (result.stdout || "").trim();
    let errorOutput = result.compile_output || result.stderr || (result.status && result.status.id !== 3 ? result.status.description : null);
    
    let isPassed = false;
    let verdictStr: any = 'PENDING';

    if (errorOutput) {
      if (result.status?.id === 6) verdictStr = 'COMPILATION_ERROR';
      else if (result.status?.id === 5) verdictStr = 'TIME_LIMIT_EXCEEDED';
      else verdictStr = 'RUNTIME_ERROR';
      allPassed = false;
    } else if (!JudgeService.checkOutput(tc.expectedOutputRef, actualOutput, 'exact')) {
      isPassed = false;
      verdictStr = 'WRONG_ANSWER';
      allPassed = false;
    } else {
      isPassed = true;
      verdictStr = 'ACCEPTED';
      passedTests++;
    }

    if (!isPassed && !failedTestCaseId) failedTestCaseId = tc.id;

    const testResult = await prisma.submissionTestResult.create({
      data: {
        submissionId,
        testCaseId: tc.id,
        verdict: verdictStr,
        executionTimeMs: result.time ? parseFloat(result.time) * 1000 : 0,
        memoryUsedKb: result.memory || 0,
        actualOutput: tc.isSample ? actualOutput : 'HIDDEN',
        errorOutput
      }
    });

    try {
      getIO().to(`submission:${submissionId}`).emit('submission:progress', {
        submissionId,
        testResult,
        passedTests,
        totalTests: testCases.length
      });
    } catch (e) {}

    // Optional Early Termination
    if (!isPassed) break;
  }

  const finalVerdict = allPassed ? 'ACCEPTED' : (failedTestCaseId ? 'WRONG_ANSWER' : 'RUNTIME_ERROR');
  
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      verdict: finalVerdict,
      totalTests: testCases.length,
      passedTests,
      failedTestCaseId
    }
  });

  try {
    getIO().to(`submission:${submissionId}`).emit('submission:completed', {
      submissionId,
      verdict: finalVerdict,
      passedTests,
      totalTests: testCases.length
    });
  } catch (e) {}
}

// Minimal stub for Run logic (public tests only, no db saving)
async function handleRun(jobId: string, userId: string, problemId: string, language: string, code: string) {
  // Can be expanded to store Run results to a transient store
}
