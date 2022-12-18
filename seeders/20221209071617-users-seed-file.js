'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seedUsers = []
    const seedAdminUser = {
      account: 'root',
      name: 'Root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }
    seedUsers.push(seedAdminUser)
    const seedNormalUsers = Array.from({ length: 10 }, (_, i) => ({
      account: `user${i + 1}`,
      name: `User${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync('12345678', 10),
      introduction: faker.lorem.text().substring(0, 160),
      avatar: `https://loremflickr.com/320/240/logo/?lock=${i + 1}`,
      cover: `https://loremflickr.com/720/240/landscape/?lock=${i + 1}`,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }))
    seedUsers.push(...seedNormalUsers)
    await queryInterface.bulkInsert('Users', seedUsers)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
