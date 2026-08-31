import { PrismaClient, TestCase } from '@prisma/client';

const prisma = new PrismaClient();

export class JudgeService {
  
  static checkOutput(expected: string, actual: string, type = 'exact'): boolean {
    if (!actual) return false;
    
    switch (type) {
      case 'exact':
        return expected.trim() === actual.trim();
      case 'token':
        return expected.trim().split(/\s+/).join(' ') === actual.trim().split(/\s+/).join(' ');
      case 'numeric':
        return parseFloat(expected) === parseFloat(actual);
      default:
        return expected.trim() === actual.trim();
    }
  }

  static async submitToJudge0(code: string, languageId: number, stdin: string, timeLimitMs: number, memoryLimitMb: number) {
    const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';
    const payload = {
      source_code: code,
      language_id: languageId,
      stdin,
      cpu_time_limit: timeLimitMs / 1000,
      memory_limit: memoryLimitMb * 1024
    };

    const res = await fetch(`${JUDGE0_URL}/submissions?wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    return await res.json();
  }

  static getLanguageId(lang: string): number {
    const map: Record<string, number> = {
      CPP: 54,
      JAVA: 62,
      PYTHON: 71,
      JAVASCRIPT: 93
    };
    return map[lang.toUpperCase()] || 93;
  }
}
