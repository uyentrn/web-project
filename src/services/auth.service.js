const crypto = require('crypto');
const { AppError, conflict, invalid, notFound, translatePrismaError } = require('./errors');

class AuthService {
  constructor(prisma, { passwordHasher, tokenIssuer, accessTtlMs, refreshTtlMs }) {
    if (!prisma || !passwordHasher || !tokenIssuer || !accessTtlMs || !refreshTtlMs) {
      throw new Error('AuthService requires prisma, passwordHasher, tokenIssuer, accessTtlMs, and refreshTtlMs.');
    }
    this.prisma = prisma;
    this.passwordHasher = passwordHasher;
    this.tokenIssuer = tokenIssuer;
    this.accessTtlMs = accessTtlMs;
    this.refreshTtlMs = refreshTtlMs;
  }

  async register({ email, password, name }) {
    const normalizedEmail = validateEmail(email);
    validatePassword(password);
    const existingUser = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) throw conflict('An account with this email already exists.');

    try {
      const user = await this.prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: { 
            email: normalizedEmail, 
            passwordHash: await this.passwordHasher.hash(password), 
            name: normalizeOptionalText(name, 'Name'),
            role:"CLIENT" 
          },
        });
        await tx.cart.create({
          data: {
            userId: createdUser.id,
          },
        });
        return createdUser;
      });
      return this.#createSessionTokens(user);
    } catch (error) {
      throw translatePrismaError(error);
    }
  }

  async login({ email, password }) {
    const normalizedEmail = validateEmail(email);
    if (typeof password !== 'string' || !password) throw invalid('Password is required.');
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !(await this.passwordHasher.compare(password, user.passwordHash))) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }
    return this.#createSessionTokens(user);
  }

  async refresh(refreshToken) {
    if (typeof refreshToken !== 'string' || !refreshToken) throw invalid('Refresh token is required.');
    let payload;
    try {
      payload = await this.tokenIssuer.verifyRefresh(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token.', 401, 'INVALID_REFRESH_TOKEN');
    }
    if (!payload?.sub || !payload?.sid) throw new AppError('Invalid refresh token.', 401, 'INVALID_REFRESH_TOKEN');
    const session = await this.prisma.session.findFirst({
      where: { id: payload.sid, userId: payload.sub, tokenHash: hashToken(refreshToken), revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
    if (!session) throw new AppError('Invalid or expired refresh token.', 401, 'INVALID_REFRESH_TOKEN');
    return { accessToken: await this.tokenIssuer.signAccess({ sub: session.userId, sid: session.id }, this.accessTtlMs) };
  }

  async logout({ userId, sessionId }) {
    if (!userId || !sessionId) throw invalid('Authenticated user and session are required.');
    const result = await this.prisma.session.updateMany({
      where: { id: sessionId, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (!result.count) throw notFound('Active session');
  }

  async #createSessionTokens(user) {
    const sessionId = crypto.randomUUID();
    const refreshToken = await this.tokenIssuer.signRefresh({ sub: user.id, sid: sessionId }, this.refreshTtlMs);
    const expiresAt = new Date(Date.now() + this.refreshTtlMs);
    await this.prisma.session.create({ data: { id: sessionId, userId: user.id, tokenHash: hashToken(refreshToken), expiresAt } });
    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken: await this.tokenIssuer.signAccess({ sub: user.id, sid: sessionId, role: user.role }, this.accessTtlMs),
      refreshToken,
    };
  }
}

function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
function validateEmail(email) {
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw invalid('A valid email is required.');
  return email.trim().toLowerCase();
}
function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) throw invalid('Password must be at least 8 characters long.');
}
function normalizeOptionalText(value, field) {
  if (value == null) return null;
  if (typeof value !== 'string' || !value.trim()) throw invalid(`${field} must be a non-empty string.`);
  return value.trim();
}

module.exports = AuthService;
