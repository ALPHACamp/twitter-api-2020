'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')
const usersSeeds = require('./seeds/usersSeeds.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 處理要存入的userSeeds資料
    const usersToInsert = usersSeeds.map(user => ({
      account: user.account,
      email: user.email,
      password: bcrypt.hashSync(user.password, 10),
      role: user.role,
      avatar: faker.image.avatar(),
      cover: 'https://i.imgur.com/xwLLnZh.png',
      introduction: faker.string.alphanumeric({ length: { min: 1, max: 160 } }),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    // 存入Users model
    await queryInterface.bulkInsert('Users', usersToInsert, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
