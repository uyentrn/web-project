const bcrypt = require('bcryptjs');
const { UserRole } = require('@prisma/client');
const users = require('../data/users');

const SALT_ROUNDS = 10;

module.exports = async function seedUsers(prisma) {
  const result = [];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);

    const created = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        role: user.role,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
      },
    });

    result.push(created);
  }

  return result;
};