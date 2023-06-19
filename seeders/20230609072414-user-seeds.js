'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const admin = {
      // 一組admin
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'root',
      role: 'admin',
      avatar: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 100)}`,
      introduction: "I'm admin.",
      createdAt: new Date(),
      updatedAt: new Date(),
      account: 'root',
      banner: `https://loremflickr.com/640/480/mountain/?lock=${Math.random() * 100}`
    }

    const users = []
    // 五組隨機user
    for (let i = 0; i < 5; i++) {
      const maxLength = 160
      let randomText = faker.lorem.text(140)
      if (randomText.length > maxLength) {
        randomText = randomText.substring(0, maxLength)
      }
      users.push({
        email: `user${i + 1}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        name: `user${i + 1}`,
        role: 'user',
        avatar: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 100)}`,
        introduction: randomText,
        createdAt: new Date(),
        updatedAt: new Date(),
        account: `user${i + 1}`,
        banner: `https://loremflickr.com/640/480/mountain/?lock=${Math.random() * 100}`
      })
    }

    await queryInterface.bulkInsert('Users', [admin])
    await queryInterface.bulkInsert('Users', users)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
