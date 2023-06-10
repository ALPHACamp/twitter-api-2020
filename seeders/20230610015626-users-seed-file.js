'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'root name',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user1 name',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user2 name',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user3 name',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user4 name',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user5 name',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
