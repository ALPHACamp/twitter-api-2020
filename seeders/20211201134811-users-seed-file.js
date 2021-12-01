'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          account: 'root',
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'Admin',
          name: 'root',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user1',
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user2',
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user2',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user3',
          email: 'user3@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user3',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user4',
          email: 'user4@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user4',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user5',
          email: 'user5@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user5',
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
