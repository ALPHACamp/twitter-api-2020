'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'root',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: true,
        account: 'root',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user1',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: false,
        account: 'user1',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user2',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: false,
        account: 'user2',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user3@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user3',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: false,
        account: 'user3',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user4@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user4',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: false,
        account: 'user4',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user5@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user5',
        avatar: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: false,
        account: 'user5',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
