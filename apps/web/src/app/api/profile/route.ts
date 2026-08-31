import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId') || 'dummy-user-id';
    
    // Fetch Profile and Skills
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { skillTags: true }
    });

    // Fetch Solved Problems
    const submissions = await prisma.submission.findMany({
      where: { 
        userId, 
        verdict: 'ACCEPTED' 
      },
      include: {
        problem: true
      }
    });

    // Deduplicate solved problems
    const solvedProblemTitles = Array.from(new Set(submissions.map(s => s.problem.title)));

    return NextResponse.json({
      profile: profile || null,
      solvedProblems: solvedProblemTitles
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
