'use strict'

const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.imgur.com/tQzgcPK.png',
      banner: 'https://i.imgur.com/xwLLnZh.png',
      introduction: faker.string.alphanumeric({ length: { min: 1, max: 160 } }),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user1',
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: faker.image.avatar(),
      banner: 'https://i.imgur.com/xwLLnZh.png',
      introduction: faker.string.alphanumeric({ length: { min: 1, max: 160 } }),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user2',
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: faker.image.avatar(),
      banner: 'https://i.imgur.com/xwLLnZh.png',
      introduction: faker.string.alphanumeric({ length: { min: 1, max: 160 } }),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user3',
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: faker.image.avatar(),
      banner: 'https://i.imgur.com/xwLLnZh.png',
      introduction: faker.string.alphanumeric({ length: { min: 1, max: 160 } }),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user4',
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: faker.image.avatar(),
      banner: 'https://i.imgur.com/xwLLnZh.png',
      introduction: faker.string.alphanumeric({ length: { min: 1, max: 160 } }),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user5',
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: faker.image.avatar(),
      banner: 'https://i.imgur.com/xwLLnZh.png',
      introduction: faker.string.alphanumeric({ length: { min: 1, max: 160 } }),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
