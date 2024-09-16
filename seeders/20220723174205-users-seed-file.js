'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        account: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'root',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        account: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user1',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        account: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user2',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        account: 'user3',
        email: 'user3@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user3',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        account: 'user4',
        email: 'user4@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user4',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        account: 'user5',
        email: 'user5@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'user5',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
