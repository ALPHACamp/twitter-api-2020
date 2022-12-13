'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'root',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user3',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user4',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user5',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
