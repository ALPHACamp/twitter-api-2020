'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'root',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'root',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user1',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user1',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user2',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user2',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user3',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user3',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user4',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user4',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user5',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user5',
          cover: 'https://i.imgur.com/JJozKMp.png'
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
