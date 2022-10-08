
'use strict'
const bcrypt = require('bcrypt-nodejs')
module.exports = {
  up: (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkInsert(
        'Users',
        [
          {
            name: 'admin',
            account: 'admin',
            email: 'root@example.com',
            password: bcrypt.hashSync('12345678'),
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: 'user1',
            account: 'user1',
            email: 'user1@example.com',
            password: bcrypt.hashSync('12345678'),
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: 'user2',
            account: 'user2',
            email: 'user2@example.com',
            password: bcrypt.hashSync('12345678'),
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: 'user3',
            account: 'user3',
            email: 'user3@example.com',
            password: bcrypt.hashSync('12345678'),
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: 'user4',
            account: 'user4',
            email: 'user4@example.com',
            password: bcrypt.hashSync('12345678'),
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: 'user5',
            account: 'user5',
            email: 'user5@example.com',
            password: bcrypt.hashSync('12345678'),
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        {}
      )
    } catch (error) {
      console.log(error)
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {})
  }
}
