'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      name: 'root',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user3',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user4',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user5',
      created_at: new Date(),
      updated_at: new Date()
    }], {})

    await queryInterface.bulkInsert('Users', [{
      account: 'user6',
      email: 'user6@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user6',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      account: 'user7',
      email: 'user7@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user7',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account: 'user8',
      email: 'user8@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user8',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account: 'user9',
      email: 'user9@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user9',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account: 'user10',
      email: 'user10@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user10',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
