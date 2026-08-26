import prisma from '../../config/db';

export class ApplicationsService {
  async applyToJob(userId: string, jobId: string, resumeId: string) {
    // 1. Check if job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error('Job not found');

    // 2. Check if already applied (handled by DB constraint as well, but good practice)
    const existing = await prisma.application.findUnique({
      where: {
        jobId_userId: { jobId, userId }
      }
    });
    if (existing) throw new Error('You have already applied to this job');

    // 3. Create application
    return prisma.application.create({
      data: {
        jobId,
        userId,
        resumeId,
        status: 'APPLIED'
      }
    });
  }

  async updateApplicationStatus(id: string, status: 'UNDER_REVIEW' | 'SHORTLISTED' | 'REJECTED' | 'HIRED') {
    return prisma.application.update({
      where: { id },
      data: { status }
    });
  }
}
