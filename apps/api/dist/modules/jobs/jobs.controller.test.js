"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jobs_controller_1 = require("./jobs.controller");
const db_1 = __importDefault(require("../../config/db"));
(0, vitest_1.describe)('JobsController', () => {
    let controller;
    let req;
    let res;
    let jsonMock;
    let statusMock;
    (0, vitest_1.beforeEach)(() => {
        controller = new jobs_controller_1.JobsController();
        jsonMock = vitest_1.vi.fn();
        statusMock = vitest_1.vi.fn().mockReturnValue({ json: jsonMock });
        req = { query: {}, body: {}, params: {}, user: { userId: 'u1', role: 'RECRUITER' } };
        res = { status: statusMock, json: jsonMock };
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should get all jobs', async () => {
        const mockJobs = [{ id: '1', title: 'SWE' }];
        vitest_1.vi.spyOn(controller['jobsService'], 'getJobs').mockResolvedValueOnce({ jobs: mockJobs, total: 1, page: 1, limit: 10 });
        await controller.getJobs(req, res);
        (0, vitest_1.expect)(statusMock).toHaveBeenCalledWith(200);
        (0, vitest_1.expect)(jsonMock).toHaveBeenCalledWith({ success: true, data: { jobs: mockJobs, total: 1, page: 1, limit: 10 } });
    });
    (0, vitest_1.it)('should create a job', async () => {
        req.body = { title: 'Backend Eng' };
        const mockJob = { id: '2', title: 'Backend Eng' };
        db_1.default.company.findUnique.mockResolvedValueOnce({ id: 'c1' });
        vitest_1.vi.spyOn(controller['jobsService'], 'createJob').mockResolvedValueOnce(mockJob);
        await controller.createJob(req, res);
        (0, vitest_1.expect)(statusMock).toHaveBeenCalledWith(201);
        (0, vitest_1.expect)(jsonMock).toHaveBeenCalledWith({ success: true, data: mockJob });
    });
    (0, vitest_1.it)('should return 401 if user is not in request when creating job', async () => {
        req.user = undefined;
        await controller.createJob(req, res);
        (0, vitest_1.expect)(statusMock).toHaveBeenCalledWith(401);
        (0, vitest_1.expect)(jsonMock).toHaveBeenCalledWith({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    });
    (0, vitest_1.it)('should delete a job', async () => {
        req.params = { id: '123' };
        db_1.default.company.findUnique.mockResolvedValueOnce({ id: 'c1' });
        db_1.default.job.findUnique.mockResolvedValueOnce({ id: '123', companyId: 'c1' });
        vitest_1.vi.spyOn(controller['jobsService'], 'deleteJob').mockResolvedValueOnce({ id: '123' });
        await controller.deleteJob(req, res);
        (0, vitest_1.expect)(statusMock).toHaveBeenCalledWith(200);
    });
});
