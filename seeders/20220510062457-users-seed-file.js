'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = []
    const userCount = 13
    for (let i = 0; i < userCount; i++) {
      data.push({
        account: `user${i}`,
        name: `user${i}`,
        email: `user${i}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        avatar: `https://loremflickr.com/250/250/paradise/?random=${Math.random() * 100}`,
        introduction: 'faker.lorem.text()',
        cover: `https://loremflickr.com/800/350/selfie/?random=${Math.random() * 100}`,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      })
    }
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/250/250/paradise/?random=${Math.random() * 100}`,
      introduction: faker.lorem.text(),
      cover: `https://loremflickr.com/800/350/selfie/?random=${Math.random() * 100}`,
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, ...data], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
