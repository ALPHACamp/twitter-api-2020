'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const SEED_USERS = 10

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',
      [{
        account: 'root',
        name: 'Root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', 10),
        avatar: `https://loremflickr.com/320/320/man,woman/?lock=${Math.random() * 100}`,
        cover: 'https://i.imgur.com/dIsjVjn.jpeg',
        introduction: faker.lorem.sentence(7),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...Array.from({ length: SEED_USERS }, (_, i) => ({
        account: `user${i + 1}`,
        name: `User${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: bcrypt.hashSync('12345678', 10),
        avatar: `https://loremflickr.com/320/320/man,woman/?lock=${Math.random() * 100}`,
        cover: 'https://i.imgur.com/dIsjVjn.jpeg',
        introduction: faker.lorem.sentence(7),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
