'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'User1',
        account: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'User2',
        account: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'User3',
        account: 'user3',
        email: 'user3@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'User4',
        account: 'user4',
        email: 'user4@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'User5',
        account: 'user5',
        email: 'user5@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
