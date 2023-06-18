'use strict'
const bcrypt = require('bcryptjs')
const { getDate } = require('../_helpers')
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
    for (let i = 1; i < 6; i++) {
      const userData = {
        account: `user${i}`,
        name: `user${i}`,
        email: `user${i}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        created_at: getDate(),
        updated_at: getDate(),
        introduction: `user${i} introduction`
      }
      usersData.push(userData)
    }
    await queryInterface.bulkInsert('Users', usersData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
