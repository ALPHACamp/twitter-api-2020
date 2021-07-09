const bcrypt = require('bcryptjs')
const faker = require('faker')
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      account: '@root',
      name: 'root',
      email: 'root@example.com',
      role: 'admin',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      bio: faker.lorem.sentence(),
      avatar: faker.image.image(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      account: '@user1',
      name: 'user1',
      email: 'user1@example.com',
      role: 'user',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      bio: faker.lorem.sentence(),
      avatar: faker.image.image(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      account: '@user2',
      name: 'user2',
      email: 'user2@example.com',
      role: 'user',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      bio: faker.lorem.sentence(),
      avatar: faker.image.image(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      account: '@user3',
      name: 'user3',
      email: 'user3@example.com',
      role: 'user',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      bio: faker.lorem.sentence(),
      avatar: faker.image.image(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      account: '@user4',
      name: 'user4',
      email: 'user4@example.com',
      role: 'user',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      bio: faker.lorem.sentence(),
      avatar: faker.image.image(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      account: '@user5',
      name: 'user5',
      email: 'user5@example.com',
      role: 'user',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      bio: faker.lorem.sentence(),
      avatar: faker.image.image(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

