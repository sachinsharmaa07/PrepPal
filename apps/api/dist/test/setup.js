"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
class MockPrismaClient {
    user = {
        findUnique: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
    };
    job = {
        findMany: vitest_1.vi.fn(),
        findUnique: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
    };
    company = {
        findUnique: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
    };
    $connect = vitest_1.vi.fn();
    $disconnect = vitest_1.vi.fn();
}
vitest_1.vi.mock('@prisma/client', () => {
    return {
        PrismaClient: MockPrismaClient
    };
});
