const {
  notFound,
  invalid,
  translatePrismaError,
} = require('./errors');

class UserService {
  constructor(prisma) {
    if (!prisma) {
      throw new Error('UserService requires prisma.');
    }

    this.prisma = prisma;
  }

  async getProfile(userId) {
    if (!userId) {
      throw invalid('User ID is required.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw notFound('User');
    }

    return user;
  }

  async updateProfile(userId, { name }) {
    if (!userId) {
      throw invalid('User ID is required.');
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      throw translatePrismaError(error);
    }
  }
}

module.exports = UserService;