'use strict'
const bcrypt = require('bcryptjs')
const { getDate } = require('../_helpers')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }])
    const usersData = []
    const dateArray = getDate(5)
    for (let i = 1; i < 6; i++) {
      const userData = {
        account: `user${i}`,
        name: `user${i}`,
        email: `user${i}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        created_at: dateArray[i - 1],
        updated_at: dateArray[i - 1],
        introduction: `user${i} introduction`,
        confirm_token: await jwt.sign(
          { email: `user${i}@example.com` },
          process.env.JWT_SECRET
        )
      }
      usersData.push(userData)
    }
    await queryInterface.bulkInsert('Users', usersData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
