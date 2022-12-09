'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const { SEED_USERS_AMOUNT } = require('../helpers/seeder-helpers')

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
    ...Array.from({ length: SEED_USERS_AMOUNT }, (_, i) => ({
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
        ...Array.from({ length: SEED_USERS_AMOUNT }, (_, i) => `user${i + 1}`)
      ]
    })
  }
}
