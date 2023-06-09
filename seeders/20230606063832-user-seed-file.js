'use strict'
const bcrypt = require('bcrypt-nodejs')
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
    for (let index = 1; index < 6; index++) {
      const userData = {
        account: `user${index}`,
        name: `user${index}`,
        email: `user${index}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
      usersData.push(userData)
    }
    await queryInterface.bulkInsert('Users', usersData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
