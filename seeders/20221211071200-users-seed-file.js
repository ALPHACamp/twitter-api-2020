'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_PASSWORD = '12345678'
    await queryInterface.bulkInsert(
      'Users',
      [{
        account: 'root',
        name: 'Admin',
        email: 'root@example.com',
        password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }, ...Array.from({ length: 10 }, (_, i) => ({
        account: `user${i + 1}`,
        name: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: bcrypt.hashSync(DEFAULT_PASSWORD, 10),
        introduction: faker.lorem.words(6),
        avatar: `https://loremflickr.com/320/240/human/?lock=${
          Math.random() * 100
        }`,
        cover: `https://loremflickr.com/820/320/landscape/?lock=${
          Math.random() * 100
        }`,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }))],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
