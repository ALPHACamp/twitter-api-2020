'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersArray = await Promise.all(
      Array.from({ length: 5 }, async (_, i) => ({
        account: `user${i + 1}`,
        name: faker.name.findName(),
        email: `user${i + 1}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        avatar: `https://loremflickr.com/160/160/selfie/?random=${Math.random() * 100}`,
        role: 'user',
        introduction: faker.lorem.lines(1).substring(0, 160),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
    return await queryInterface.bulkInsert('Users', [{
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/160/160/selfie/?random=${Math.random() * 100}`,
      role: 'admin',
      introduction: faker.lorem.lines(1).substring(0, 140),
      created_at: new Date(),
      updated_at: new Date()
    },
    ...usersArray
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Users', {})
  }
}
