import { vi } from 'vitest';

class MockPrismaClient {
  user = {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };
  job = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };
  company = {
    findUnique: vi.fn(),
    create: vi.fn(),
  };
  $connect = vi.fn();
  $disconnect = vi.fn();
}

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: MockPrismaClient
  };
});
