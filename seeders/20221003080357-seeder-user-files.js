'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_PASSWORD = '12345678'
    const NUMBER_OF_USERS = 10
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        name: 'root',
        account: 'root',
        password: bcrypt.hashSync(DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...Array.from({ length: NUMBER_OF_USERS }, (_, i) => ({
        email: `user${i + 1}@example.com`,
        name: `user${i + 1}`,
        avatar: `https://loremflickr.com/320/240/man,woman/?random=${Math.floor(Math.random() * 50)}`,
        introduction: faker.lorem.sentence(3),
        account: `user${i + 1}`,
        password: bcrypt.hashSync(DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {})
  }
}
