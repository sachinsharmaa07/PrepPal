import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const problems = await prisma.codingProblem.findMany({
      include: {
        testCases: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    return NextResponse.json(problems);
  } catch (error: any) {
    console.error('Problems fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}
