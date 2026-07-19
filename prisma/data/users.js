const { UserRole } = require('@prisma/client');

module.exports = [
  {
    email: 'admin@perfume.com',
    password: 'Admin@123',
    name: 'System Administrator',
    role: UserRole.ADMIN,
  },

  {
    email: 'alice@gmail.com',
    password: '123456',
    name: 'Alice Johnson',
    role: UserRole.CLIENT,
  },

  {
    email: 'bob@gmail.com',
    password: '123456',
    name: 'Bob Smith',
    role: UserRole.CLIENT,
  },

  {
    email: 'charlie@gmail.com',
    password: '123456',
    name: 'Charlie Brown',
    role: UserRole.CLIENT,
  },

  {
    email: 'david@gmail.com',
    password: '123456',
    name: 'David Wilson',
    role: UserRole.CLIENT,
  },

  {
    email: 'emma@gmail.com',
    password: '123456',
    name: 'Emma Taylor',
    role: UserRole.CLIENT,
  },

  {
    email: 'frank@gmail.com',
    password: '123456',
    name: 'Frank Thomas',
    role: UserRole.CLIENT,
  },

  {
    email: 'grace@gmail.com',
    password: '123456',
    name: 'Grace Lee',
    role: UserRole.CLIENT,
  },

  {
    email: 'henry@gmail.com',
    password: '123456',
    name: 'Henry Walker',
    role: UserRole.CLIENT,
  },

  {
    email: 'isabella@gmail.com',
    password: '123456',
    name: 'Isabella Hall',
    role: UserRole.CLIENT,
  },

  {
    email: 'jack@gmail.com',
    password: '123456',
    name: 'Jack Young',
    role: UserRole.CLIENT,
  },
];