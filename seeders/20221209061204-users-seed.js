'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const NUMBER_OF_SEED_USERS = 10

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_PASSWORD = '12345678'
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      account: 'root',
      email: ' root@example.com',
      password: bcrypt.hashSync(DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
      introduction: faker.lorem.sentences(6),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ...Array.from({ length: NUMBER_OF_SEED_USERS }, (_, i) => ({
      name: `user${i + 1}`,
      account: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync(DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
      introduction: faker.lorem.sentences(6),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {
      account: [
        'root',
        ...Array.from({ length: NUMBER_OF_SEED_USERS }, (_, i) => `user${i + 1}`)
      ]
    })
  }
}
