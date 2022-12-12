'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const { SEED_USERS_AMOUNT } = require('../helpers/seeder-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_PASSWORD = '12345678'
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      account: 'root',
      email: ' root@example.com',
      password: bcrypt.hashSync(DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
      introduction: faker.lorem.sentences(6),
      avatar: `https://loremflickr.com/320/240/man,woman/?random=${Math.floor(Math.random() * 100)}`,
      cover: 'https://picsum.photos/1500/800',
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
      avatar: `https://loremflickr.com/320/240/man,woman/?random=${Math.floor(Math.random() * 100)}`,
      cover: 'https://picsum.photos/1500/800',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { })
  }
}
