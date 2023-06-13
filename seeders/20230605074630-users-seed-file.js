'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
const background = 'https://images.unsplash.com/photo-1580436541340-36b8d0c60bae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'root',
        avatar: `https://loremflickr.com/320/240/person/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: 'admin',
        account: 'root',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user1',
        avatar: `https://loremflickr.com/320/240/person/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user1',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user2',
        avatar: `https://loremflickr.com/320/240/person/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user2',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user3@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user3',
        avatar: `https://loremflickr.com/320/240/person/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user3',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user4@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user4',
        avatar: `https://loremflickr.com/320/240/person/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user4',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'user5@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user5',
        avatar: `https://loremflickr.com/320/240/person/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        role: 'user',
        account: 'user5',
        background,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
