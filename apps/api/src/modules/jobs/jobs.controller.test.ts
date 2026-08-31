import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobsController } from './jobs.controller';
import { Request, Response } from 'express';
import prisma from '../../config/db';

describe('JobsController', () => {
  let controller: JobsController;
  let req: any;
  let res: any;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    controller = new JobsController();
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    req = { query: {}, body: {}, params: {}, user: { userId: 'u1', role: 'RECRUITER' } };
    res = { status: statusMock, json: jsonMock };
    vi.clearAllMocks();
  });

  it('should get all jobs', async () => {
    const mockJobs = [{ id: '1', title: 'SWE' }];
    vi.spyOn(controller['jobsService'], 'getJobs').mockResolvedValueOnce({ jobs: mockJobs as any, total: 1, page: 1, limit: 10 });

    await controller.getJobs(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { jobs: mockJobs, total: 1, page: 1, limit: 10 } });
  });

  it('should create a job', async () => {
    req.body = { title: 'Backend Eng' };
    const mockJob = { id: '2', title: 'Backend Eng' };
    (prisma.company.findUnique as any).mockResolvedValueOnce({ id: 'c1' });
    vi.spyOn(controller['jobsService'], 'createJob').mockResolvedValueOnce(mockJob as any);

    await controller.createJob(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockJob });
  });

  it('should return 401 if user is not in request when creating job', async () => {
    req.user = undefined;
    
    await controller.createJob(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
  });

  it('should delete a job', async () => {
    req.params = { id: '123' };
    (prisma.company.findUnique as any).mockResolvedValueOnce({ id: 'c1' });
    (prisma.job.findUnique as any).mockResolvedValueOnce({ id: '123', companyId: 'c1' });
    vi.spyOn(controller['jobsService'], 'deleteJob').mockResolvedValueOnce({ id: '123' } as any);

    await controller.deleteJob(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
  });
});
