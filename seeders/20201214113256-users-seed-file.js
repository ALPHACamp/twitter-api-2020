'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      Array.from({ length: 6 }).map((d, i) => ({
        id: i * 10 + 1,
        email: i === 0 ? 'root@example.com' : `user${i}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: i === 0 ? 'root' : `user${i}`,
        account: i === 0 ? '@root' : `@user${i}`,
        introduction: faker.lorem.text(),
        avatar: `https://loremflickr.com/320/240/avatar/?random=${Math.random() * 100}`,
        cover: `https://loremflickr.com/320/240/background/?random=${Math.random() * 100}`,
        role: i === 0 ? 'admin' : 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
