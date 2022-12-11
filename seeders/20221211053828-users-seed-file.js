'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      name: 'Root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user1',
      name: 'User1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user2',
      name: 'User2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user3',
      name: 'User3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user4',
      name: 'User4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      account: 'user5',
      name: 'User5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
