'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        account: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'root',
        avatar: 'https://loremflickr.com/320/240/cat?random=${Math.random() * 100}',
        introduction: faker.lorem.text(),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        account: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user1',
        avatar: 'https://loremflickr.com/320/240/cat?random=${Math.random() * 100}',
        introduction: faker.lorem.text(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        account: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user2',
        avatar: 'https://loremflickr.com/320/240/cat?random=${Math.random() * 100}',
        introduction: faker.lorem.text(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        account: 'user3',
        email: 'user3@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user3',
        avatar: 'https://loremflickr.com/320/240/cat?random=${Math.random() * 100}',
        introduction: faker.lorem.text(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        account: 'user4',
        email: 'user4@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user4',
        avatar: 'https://loremflickr.com/320/240/cat?random=${Math.random() * 100}',
        introduction: faker.lorem.text(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        account: 'user5',
        email: 'user5@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user5',
        avatar: 'https://loremflickr.com/320/240/cat?random=${Math.random() * 100}',
        introduction: faker.lorem.text(),
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
