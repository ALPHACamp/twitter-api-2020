'use strict'
const bcrypt = require('bcrypt')
const banner = 'https://i.imgur.com/jsrSDDm.png'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      name: 'root',
      account: 'root',
      avatar: faker.image.avatar(),
      banner: banner,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user1',
      account: 'user1',
      avatar: faker.image.avatar(),
      banner: banner,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user2',
      account: 'user2',
      avatar: faker.image.avatar(),
      banner: banner,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user3',
      account: 'user3',
      avatar: faker.image.avatar(),
      banner: banner,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user4',
      account: 'user4',
      avatar: faker.image.avatar(),
      banner: banner,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user5',
      account: 'user5',
      avatar: faker.image.avatar(),
      banner: banner,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user6@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user6',
      account: 'user6',
      avatar: faker.image.avatar(),
      banner: banner,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user7@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user7',
      account: 'user7',
      avatar: faker.image.avatar(),
      banner: banner,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user8@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user8',
      account: 'user8',
      avatar: faker.image.avatar(),
      banner: banner,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'user9@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user9',
      account: 'user9',
      avatar: faker.image.avatar(),
      banner: banner,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
