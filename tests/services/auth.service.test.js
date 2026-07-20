const AuthService = require('../../src/services/auth.service');

describe('AuthService', () => {
  const passwordHasher = { hash: jest.fn(), compare: jest.fn() };
  const tokenIssuer = { signAccess: jest.fn(), signRefresh: jest.fn(), verifyRefresh: jest.fn() };

  beforeEach(() => jest.resetAllMocks());

  function createService(prisma) {
    return new AuthService(prisma, { passwordHasher, tokenIssuer, accessTtlMs: 9000000000, refreshTtlMs: 86400000 });
  }

  it('registers a user and creates a session token pair', async () => {
    const prisma = {
      user: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({ id: 'u-1', email: 'a@example.com', name: 'Ada' }) },
      session: { create: jest.fn().mockResolvedValue({}) },
    };
    passwordHasher.hash.mockResolvedValue('hash');
    tokenIssuer.signRefresh.mockResolvedValue('refresh-token');
    tokenIssuer.signAccess.mockResolvedValue('access-token');

    await expect(createService(prisma).register({ email: ' A@EXAMPLE.com ', password: 'long-enough', name: ' Ada ' }))
      .resolves.toEqual(expect.objectContaining({ accessToken: 'access-token', refreshToken: 'refresh-token', user: { id: 'u-1', email: 'a@example.com', name: 'Ada' } }));
    expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ email: 'a@example.com', passwordHash: 'hash', name: 'Ada' }) }));
    expect(prisma.session.create).toHaveBeenCalledTimes(1);
  });

  it('rejects invalid registration input before querying Prisma', async () => {
    const prisma = { user: { findUnique: jest.fn() }, session: { create: jest.fn() } };

    await expect(createService(prisma).register({ email: 'invalid', password: 'short' }))
      .rejects.toMatchObject({ statusCode: 400, code: 'VALIDATION_ERROR' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('returns an authentication error for a rejected refresh token', async () => {
    const prisma = { session: { findFirst: jest.fn() } };
    tokenIssuer.verifyRefresh.mockRejectedValue(new Error('expired'));

    await expect(createService(prisma).refresh('expired-token'))
      .rejects.toMatchObject({ statusCode: 401, code: 'INVALID_REFRESH_TOKEN' });
    expect(prisma.session.findFirst).not.toHaveBeenCalled();
  });
});
