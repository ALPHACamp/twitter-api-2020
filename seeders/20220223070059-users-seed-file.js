'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const PASSWORD = '12345678'
const AVATAR = 'https://i.imgur.com/zYddUs8.png'
const COVER = 'https://i.imgur.com/dfpDjBN.jpg'
const USER_AMOUNT = 15

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash(PASSWORD, 10),
      introduction: faker.lorem.text().slice(0, 150),
      avatar: AVATAR,
      cover: COVER,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ...Array.from({ length: USER_AMOUNT }, (v, i) => ({
      account: `user${i + 1}`,
      name: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync(PASSWORD, 10),
      introduction: faker.lorem.text().slice(0, 150),
      avatar: AVATAR,
      cover: COVER,
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
