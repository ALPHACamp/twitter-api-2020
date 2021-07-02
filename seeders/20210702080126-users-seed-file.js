'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'root',
        account: 'root',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user1',
        account: 'user1',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user2',
        account: 'user2',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user3',
        account: 'user3',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user4',
        account: 'user4',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user5',
        account: 'user5',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, { truncate: true })
  }
}
