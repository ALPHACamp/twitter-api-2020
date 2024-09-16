'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        account: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user1',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        account: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user2',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        account: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'root',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
