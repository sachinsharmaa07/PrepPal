import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma from '../../config/db';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('AuthService', () => {
  let service: AuthService;
  let mockUser: any;

  beforeEach(() => {
    service = new AuthService();
    vi.clearAllMocks();
    mockUser = { id: '1', email: 'test@test.com', passwordHash: 'hash', role: 'STUDENT', name: 'Test' };
  });

  it('should login a valid user', async () => {
    (prisma.user.findUnique as any).mockResolvedValueOnce(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never);
    vi.mocked(jwt.sign).mockReturnValue('mock-token' as any);

    const result = await service.login({ email: 'test@test.com', password: 'password' });

    expect(result.accessToken).toBe('mock-token');
    expect(result.user.id).toBe('1');
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hash');
  });

  it('should throw if user not found on login', async () => {
    (prisma.user.findUnique as any).mockResolvedValueOnce(null);

    await expect(service.login({ email: 'test@test.com', password: 'pwd' }))
      .rejects.toThrow('Invalid email or password');
  });
});
