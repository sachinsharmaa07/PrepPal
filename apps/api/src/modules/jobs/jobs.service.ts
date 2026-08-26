import prisma from '../../config/db';

export class JobsService {
  async getJobs(filters: any) {
    const { status = 'PUBLISHED', page = 1, limit = 20 } = filters;
    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await prisma.job.findMany({
      where: { status },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.job.count({ where: { status } });

    return { jobs, total, page: Number(page), limit: Number(limit) };
  }

  async getJobById(id: string) {
    return prisma.job.findUnique({ where: { id } });
  }

  async createJob(companyId: string, data: any) {
    return prisma.job.create({
      data: {
        companyId,
        title: data.title,
        description: data.description,
        requirements: data.requirements || [],
        skills: data.skills || [],
        location: data.location,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        status: 'PENDING_MODERATION',
      }
    });
  }
}
