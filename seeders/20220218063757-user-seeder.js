'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        // root admin - DoD
        {
          email: 'root@example.com',
          name: 'root',
          account: 'root',
          password: bcrypt.hashSync('12345678', 10),
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },

        // example user - DoD
        {
          email: 'user1@example.com',
          name: 'user1',
          account: 'user1',
          password: bcrypt.hashSync('12345678', 10),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },

        // other 4 regular users - DoD
        {
          email: 'nixon@example.com',
          name: 'nixon',
          account: 'nixon',
          password: bcrypt.hashSync('12345678', 10),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'ethon@example.com',
          name: 'ethon',
          account: 'ethon',
          password: bcrypt.hashSync('12345678', 10),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'louis@example.com',
          name: 'louis',
          account: 'louis',
          password: bcrypt.hashSync('12345678', 10),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'richard@example.com',
          name: 'richard',
          account: 'richard',
          password: bcrypt.hashSync('12345678', 10),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
