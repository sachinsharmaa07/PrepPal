import prisma from '../../config/db';

export class JobsService {
  async getJobs(filters: any) {
    const {
      status = 'PUBLISHED',
      page = 1,
      limit = 20,
      tenure,
      location,
      skills,
      minSalary,
      maxSalary,
      isRemote,
      sortBy = 'createdAt',
    } = filters;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { status };

    if (tenure) where.tenure = tenure;
    if (isRemote === 'true' || isRemote === true) where.isRemote = true;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (minSalary) where.salaryMin = { gte: Number(minSalary) };
    if (maxSalary) where.salaryMax = { lte: Number(maxSalary) };
    if (skills) {
      // skills is a comma-separated string
      const skillArr = skills.split(',').map((s: string) => s.trim());
      where.skills = { hasSome: skillArr };
    }

    const orderBy: any =
      sortBy === 'salary_desc'
        ? { salaryMax: 'desc' }
        : sortBy === 'salary_asc'
        ? { salaryMin: 'asc' }
        : { createdAt: 'desc' };

    const [jobs, total] = await prisma.$transaction([
      prisma.job.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        include: {
          company: {
            select: { name: true, logoUrl: true, industry: true },
          },
          _count: { select: { applications: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return { jobs, total, page: Number(page), limit: Number(limit) };
  }

  async getJobById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: {
        company: { select: { name: true, logoUrl: true, website: true, industry: true } },
        _count: { select: { applications: true } },
      },
    });
  }

  async getJobsByCompany(companyId: string) {
    return prisma.job.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } },
    });
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
        isRemote: data.isRemote ?? false,
        tenure: data.tenure || 'FULL_TIME',
        salaryMin: data.salaryMin ? Number(data.salaryMin) : null,
        salaryMax: data.salaryMax ? Number(data.salaryMax) : null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        status: 'PUBLISHED', // auto-publish for now
      },
    });
  }

  async updateJob(id: string, companyId: string, data: any) {
    return prisma.job.update({
      where: { id, companyId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.requirements && { requirements: data.requirements }),
        ...(data.skills && { skills: data.skills }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.isRemote !== undefined && { isRemote: data.isRemote }),
        ...(data.tenure && { tenure: data.tenure }),
        ...(data.salaryMin !== undefined && { salaryMin: data.salaryMin ? Number(data.salaryMin) : null }),
        ...(data.salaryMax !== undefined && { salaryMax: data.salaryMax ? Number(data.salaryMax) : null }),
        ...(data.deadline !== undefined && { deadline: data.deadline ? new Date(data.deadline) : null }),
        ...(data.status && { status: data.status }),
      },
    });
  }

  async deleteJob(id: string, companyId: string) {
    return prisma.job.update({
      where: { id, companyId },
      data: { status: 'CLOSED' },
    });
  }

  async applyToJob(userId: string, jobId: string, resumeId?: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error('Job not found');

    const existing = await prisma.application.findUnique({
      where: { jobId_userId: { jobId, userId } },
    });
    if (existing) throw new Error('You have already applied to this job');

    return prisma.application.create({
      data: { jobId, userId, resumeId: resumeId || null, status: 'APPLIED' },
    });
  }
}
