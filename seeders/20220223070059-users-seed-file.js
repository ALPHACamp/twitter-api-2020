'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const USER_AMOUNT = 5

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      introduction: faker.lorem.text(),
      avatar: 'https://i.imgur.com/zYddUs8.png',
      cover: 'https://i.imgur.com/dfpDjBN.jpg',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ...Array.from({ length: USER_AMOUNT }, (v, i) => ({
      account: `user${i + 1}`,
      name: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
      introduction: faker.lorem.text(),
      avatar: 'https://i.imgur.com/zYddUs8.png',
      cover: 'https://i.imgur.com/dfpDjBN.jpg',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
