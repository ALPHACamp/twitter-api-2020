'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      //is_admin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      //is_admin: false,
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      //is_admin: false,
      name: 'user2',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      //is_admin: false,
      name: 'user3',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    , {
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      //is_admin: false,
      name: 'user4',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    , {
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      //is_admin: false,
      name: 'user5',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
